declare type Maybe<T> = T | undefined | void;
declare type Fallible<T, E> = [T, null] | [null, E];
