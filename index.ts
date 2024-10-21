import {useEffect} from 'react';
import {create as createZustand} from 'zustand';
import {create as createMutative} from 'mutative';

type StoreState = {
  current: Record<string, any>;
  initial: Record<string, any>;
  setValues: (objectKey: 'current' | 'initial', object: Record<string, any>) => void;
};

export const create = (initialState: Record<string, any>) => {
  const useStore = createZustand<StoreState>(set => ({
    initial: initialState,
    current: initialState,
    setValues(objectKey, object) {
      set(state => ({
        [objectKey]: createMutative(state[objectKey], draft => {
          for (const [key, value] of Object.entries(object)) {
            (draft as Record<string, any>)[key] = value;
          }
        }),
      }));
    },
  }));

  const resetMulti = () => {
    useStore.getState().setValues(
      'current', useStore.getState().initial,
    );
  };

  const storeUtilities = {
    setInitial(object: Record<string, any>) {
      const {setValues} = useStore.getState();
      setValues('initial', object);
      setValues('current', object);
    },
    setCurrent(object: Record<string, any>) {
      useStore.getState().setValues('current', object);
    },
    reset: resetMulti,
    useResetOnUnmount() {
      useEffect(() => () => {
        resetMulti();
      }, []);
    },
  };

  return new Proxy({}, {
    get(_target, key: string) {
      const globalMethod = storeUtilities[
        key as keyof typeof storeUtilities
      ];
      if (globalMethod) {
        return globalMethod;
      }

      const storeItem = {
        get current() {
          return useStore.getState().current[key];
        },
        set current(newValue: any) {
          useStore.getState().setValues('current', {[key]: newValue});
        },
        get initial() {
          return useStore.getState().initial[key];
        },
        set initial(newValue: any) {
          useStore.getState().setValues('initial', {[key]: newValue});
          storeItem.current = newValue;
        },
        useCurrent: (selector: (v: any) => any = v => v) => (
          useStore(state => selector(state.current[key]))
        ),
        setCurrent(mutativeFunction: (draft: any) => void) {
          storeItem.current = createMutative(
            useStore.getState().current[key], mutativeFunction,
          );
        },
        reset() {
          storeItem.current = storeItem.initial;
        },
      };
      return storeItem;
    },
  });
};
