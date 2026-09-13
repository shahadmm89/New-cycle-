/**
 * Which scene is currently rendering.
 *
 * Scenes read their own times from the shared timeline via sayIn(sceneId, …),
 * so they do not strictly need this - but having the id in context keeps the
 * Remotion Studio timeline labelled and gives any future shared component a way
 * to know where in the film it is being used.
 */
import {createContext, useContext} from 'react';

export const SceneContext = createContext<string | null>(null);

export const useSceneId = (): string => {
  const id = useContext(SceneContext);
  if (!id) throw new Error('useSceneId() must be called inside a scene.');
  return id;
};
