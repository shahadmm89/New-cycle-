"""Estimate where each word starts inside a clip.

This voice links words together, so silence gaps cannot find them. Instead:
detect syllable nuclei (peaks in the 150-1000 Hz energy envelope, which track
vowel openings), then hand the nuclei out to the words in order, according to
how many syllables each word has. Approximate, but it degrades gracefully and
is far better than assuming an even spread.
"""
import wave, numpy as np, re
VOWELS='aeiouy'
def syllables(word):
    w=re.sub(r'[^a-z]','',word.lower())
    if not w: return 1
    if len(w)<=3: return 1
    n=0; prev=False
    for c in w:
        v=c in VOWELS
        if v and not prev: n+=1
        prev=v
    if w.endswith('e') and n>1: n-=1
    return max(1,n)
def load(p):
    w=wave.open(p); sr=w.getframerate()
    return np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float64)/32768, sr
def nuclei(a,sr):
    hop=int(sr*0.005); win=int(sr*0.025)
    fr=np.fft.rfftfreq(win,1/sr); band=(fr>150)&(fr<1000)
    env=[]
    for i in range(0,len(a)-win,hop):
        sp=np.abs(np.fft.rfft(a[i:i+win]*np.hanning(win)))**2
        env.append(np.sqrt(sp[band].sum()))
    env=np.array(env)
    if env.max()<=0: return []
    env/=env.max()
    k=np.hanning(11); k/=k.sum()
    sm=np.convolve(env,k,'same')
    peaks=[]
    for i in range(1,len(sm)-1):
        if sm[i]>=sm[i-1] and sm[i]>sm[i+1] and sm[i]>0.20:
            if peaks and (i-peaks[-1])*0.005<0.085:
                if sm[i]>sm[peaks[-1]]: peaks[-1]=i
            else: peaks.append(i)
    return [p*0.005 for p in peaks]
def word_times(path, text):
    a,sr=load(path)
    pk=nuclei(a,sr)
    words=text.split()
    syl=[syllables(w) for w in words]
    total=sum(syl)
    out=[]
    if len(pk)>=total:                      # enough nuclei: hand them out directly
        i=0
        for w,s in zip(words,syl):
            out.append((w, pk[i])); i+=s
    else:                                   # fall back to a syllable-proportional spread
        env=np.abs(a); idx=np.where(env>env.max()*0.02)[0]
        t0,t1=idx[0]/sr, idx[-1]/sr
        acc=0
        for w,s in zip(words,syl):
            out.append((w, t0+(t1-t0)*acc/total)); acc+=s
    return out, len(pk), total
