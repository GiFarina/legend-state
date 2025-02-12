import { computed, isArray, ObservableComputed, ObservableComputedTwoWay } from '@legendapp/state';
import { useMemo, useRef } from 'react';

export function useComputed<T>(compute: () => T | Promise<T>): ObservableComputed<T>;
export function useComputed<T>(compute: () => T | Promise<T>, deps: any[]): ObservableComputed<T>;
export function useComputed<T, T2 = T>(
    compute: () => T | Promise<T>,
    set: (value: T2) => void
): ObservableComputedTwoWay<T, T2>;
export function useComputed<T, T2 = T>(
    compute: () => T | Promise<T>,
    set: (value: T2) => void,
    deps: any[]
): ObservableComputedTwoWay<T, T2>;
export function useComputed<T, T2 = T>(
    compute: () => T | Promise<T>,
    set?: ((value: T2) => void) | any[],
    deps?: any[]
): ObservableComputed<T> | ObservableComputedTwoWay<T, T2> {
    if (!deps && isArray(set)) {
        deps = set;
        set = undefined;
    }
    const ref = useRef<{ compute?: () => T | Promise<T>; set?: (value: T2) => void }>({});
    ref.current.compute = compute;
    ref.current.set = set as (value: T2) => void;

    return useMemo(
        () => computed<T, T2>(() => ref.current.compute(), set ? (value) => ref.current.set(value) : undefined),
        deps || []
    );
}
