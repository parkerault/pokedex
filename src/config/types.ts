import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Dispatch,
} from "@reduxjs/toolkit";
import createDefaultState from "config/createDefaultState";
import { EntityActions } from "entities";

export type RootState = ReturnType<typeof createDefaultState>;
export type RootAction = EntityActions;
export type RootDispatch = Dispatch<RootAction>;

/**
 * Get a union of action creator types
 */
export type ActionTypes<T extends ActionMap> = ReturnType<T[keyof T]>;
export type ActionMap = {
  [key: string]: ActionCreatorWithPayload<any> | ActionCreatorWithoutPayload;
};

export type LocalStorageKeys = (keyof RootState)[];
export type LocalStorageObject = RootState[keyof RootState];

/**
 * A type helper for `createAction` so you don't have to declare the action
 * type constant twice.
 * @example
 * createAction('test', withPayload<{ a: number }>())
 * // is the same as
 * createAction<{ a: number }, 'test'>('test')
 */

export function withPayload<P>() {
  return (payload: P) => ({ payload });
}

export function withMeta<P, M>() {
  return (payload: P, meta: M) => ({ payload, meta });
}

/**
 * By default, Collection items should be optional, since accessing a key on
 * the collection isn't guaranteed to return a value. If we don't tell the type
 * system the the values may be undefined, it won't complain when you write a
 * selector that doesn't check the user inputs. This does make accessing items
 * from collections kind of a pain in the ass, so I recommend using the nullish
 * coalescing operator, or if you're absolutely sure it can never be undefined,
 * use `(collection.item as Item).property`.
 * @example
 * type MyCollection = { [id: string]: number }
 * const numbers: MyCollection = { a: 1 }
 * numbers.x.toString() // Typescript will consider this perfectly fine.
 */
export type Collection<T> = {
  [id: string]: T | undefined;
};

/**
 * This can be used to cast Collection<T> when you know there won't be any
 * undefined key access, like when reducing an array from Object.entries.
 */
export type KnownCollection<T> = {
  [id: string]: T;
};

export type Optional<T> = T | undefined;
