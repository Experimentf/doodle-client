type EmitResponse<T> = { data?: T | null; error?: Error };

export type ClientToServerEventsArgument<T, K> = {
  payload: T;
  response: EmitResponse<K>;
};
