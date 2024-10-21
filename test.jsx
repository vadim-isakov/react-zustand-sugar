import React from 'react';
import {render, screen, act} from '@testing-library/react';
// eslint-disable-next-line import/no-unassigned-import
import '@testing-library/jest-dom';
import {create} from './index.ts';

let store;

describe('store functionality', () => {
  beforeEach(() => {
    store = create({bears: 5, lions: 3});
    store.setCurrent({bears: 10, lions: 2});
  });

  test('create and setCurrent work correctly', () => {
    // Check initial values
    expect(store.bears.initial).toBe(5);
    expect(store.lions.initial).toBe(3);

    // Check current values
    expect(store.bears.current).toBe(10);
    expect(store.lions.current).toBe(2);
  });

  test('reset and check values', () => {
    // Check values
    expect(store.bears.initial).toBe(5);
    expect(store.bears.current).toBe(10);

    // Reset initial values
    store.bears.initial = 25;

    // Check initial and current values
    expect(store.bears.initial).toBe(25);
    expect(store.bears.current).toBe(25);
  });

  test('reset and check values by using setInitial', () => {
    // Check values
    expect(store.bears.initial).toBe(5);
    expect(store.bears.current).toBe(10);
    expect(store.lions.initial).toBe(3);
    expect(store.lions.current).toBe(2);

    // Reset initial values
    store.setInitial({bears: 25, lions: 77});

    // Check initial and current values
    expect(store.bears.initial).toBe(25);
    expect(store.bears.current).toBe(25);
    expect(store.lions.initial).toBe(77);
    expect(store.lions.current).toBe(77);
  });

  test('reset works correctly', () => {
    // Call reset with no keys
    store.reset();

    // Check if values were reset to initial
    expect(store.bears.current).toBe(5);
    expect(store.lions.current).toBe(3);
  });

  test('resetMulti correctly resets current values to initial', () => {
    // Perform a reset on both bears and lions
    store.reset(['bears', 'lions']);

    // Check if values were reset to initial
    expect(store.bears.current).toBe(5);
    expect(store.lions.current).toBe(3);
  });

  test('correctly resets single values', () => {
    // Perform a reset for single value
    store.bears.reset();
    expect(store.bears.current).toBe(5);
  });

  test('useCurrent hook returns the correct current value', () => {
    // Component to test the useCurrent hook
    const TestComponent = () => {
      const bears = store.bears.useCurrent(); // Use current value for bears
      return <div>{`Bears: ${bears}`}</div>;
    };

    render(<TestComponent />);

    // Verify the current value of bears is returned
    expect(screen.getByText('Bears: 10')).toBeInTheDocument();

    // Use `act` to ensure that the update and re-render happen properly
    act(() => {
      store.bears.current = 20; // Change the value of bears in the store
    });

    // Re-render to reflect the new value in the component
    expect(screen.getByText('Bears: 20')).toBeInTheDocument(); // Verify updated value
  });

  test('dynamically adding new key and resetting it works', () => {
    // Dynamically set a new key in store
    store.setInitial({tigers: 4});
    store.setCurrent({tigers: 8});

    // Assert initial and current values for tigers
    expect(store.tigers.initial).toBe(4);
    expect(store.tigers.current).toBe(8);

    // Reset tigers
    store.tigers.reset();

    // After reset, tigers should be reset to its initial value
    expect(store.tigers.current).toBe(4);
  });

  test('reset multiple keys using resetMulti', () => {
    // Modify current values for both bears and lions
    store.bears.current = 15;
    store.lions.current = 7;

    // Reset both bears and lions
    store.reset(['bears', 'lions']);

    // Assert that both bears and lions were reset to their initial values
    expect(store.bears.current).toBe(5);
    expect(store.lions.current).toBe(3);
  });

  test('no re-renders when current and initial values are the same, but re-renders on real change', () => {
    // Set both initial and current values to the same value
    store.setInitial({bears: 5, lions: 10});
    store.setCurrent({bears: 5, lions: 10});

    // Track render count
    let renderCount = 0;

    const TestComponent = () => {
      renderCount += 1; // Increment render count on each render

      const bears = store.bears.useCurrent();
      const lions = store.lions.useCurrent();

      return (
        <div>
          <div data-testid='bears'>{`Bears: ${bears}`}</div>
          <div data-testid='lions'>{`Lions: ${lions}`}</div>
        </div>
      );
    };

    // Initial render of the component
    const {getByTestId} = render(<TestComponent />);

    // Step 1: Check the initial values and render count
    expect(getByTestId('bears')).toHaveTextContent('Bears: 5');
    expect(getByTestId('lions')).toHaveTextContent('Lions: 10');
    expect(renderCount).toBe(1); // Initial render (should be 1)

    // Step 2: Attempt to update 'bears.current' with the same value (no re-render expected)
    act(() => {
      store.bears.current = 5; // This is the same as the initial value
    });

    // Check that no re-render occurred since the value hasn't changed
    expect(renderCount).toBe(1); // Still only 1 render

    // Step 3: Make a real change to 'bears.current' (this should trigger a re-render)
    act(() => {
      store.bears.current = 15; // This is a new value, so it should trigger a re-render
    });

    // Ensure the component re-rendered and the new value is displayed
    expect(getByTestId('bears')).toHaveTextContent('Bears: 15');
    expect(renderCount).toBe(2); // Render count should now be 2 (after real change)
  });

  test('useResetOnUnmount with multiple keys resets them correctly on unmount', () => {
    const TestComponent = () => {
      store.useResetOnUnmount();
      return (
        <div>
          <div>{`Bears: ${store.bears.current}`}</div>
          <div>{`Lions: ${store.lions.current}`}</div>
        </div>
      );
    };

    const {unmount} = render(<TestComponent />);

    // Before unmounting, bears and lions should retain their current values
    expect(store.bears.current).toBe(10);
    expect(store.lions.current).toBe(2);

    // Unmount the component
    unmount();

    // After unmounting, both bears and lions should reset to their initial values
    expect(store.bears.current).toBe(5);
    expect(store.lions.current).toBe(3);
  });

  test('updates to non-rendered values do not cause extra re-renders, and no re-render when same value is set', () => {
    // Create a variable to track the number of renders
    const renderCountReference = {count: 0};

    const TestComponent = () => {
      // Increment the render count on every render
      renderCountReference.count += 1;

      // Render only the 'bears' current value, not the 'lions'
      const bears = store.bears.useCurrent();

      return <div data-testid='bears'>{`Bears: ${bears}`}</div>;
    };

    // Initial render of the component
    const {getByTestId, rerender} = render(<TestComponent />);

    // Check that the component rendered initially
    expect(renderCountReference.count).toBe(1); // Initial render
    expect(getByTestId('bears')).toHaveTextContent('Bears: 10'); // Default value for 'bears' current state

    // Step 1: Update a value that is NOT rendered (e.g., 'lions.current')
    expect(store.lions.current).toBe(2);
    store.lions.reset();
    expect(store.lions.current).toBe(3);
    act(() => {
      store.lions.current = 20; // This should NOT trigger a re-render
    });
    expect(store.lions.current).toBe(20);
    // Ensure the render count is still 1, meaning no re-render occurred
    expect(renderCountReference.count).toBe(1); // No re-render after 'lions' update
    expect(getByTestId('bears')).toHaveTextContent('Bears: 10'); // Bears value should still be 10

    // Step 2: Update a value that IS rendered (e.g., 'bears.current')
    act(() => {
      store.bears.current = 15; // This SHOULD trigger a re-render
    });

    // Ensure the render count is now 2, meaning a re-render occurred
    expect(renderCountReference.count).toBe(2); // Re-render occurred after 'bears' update
    expect(getByTestId('bears')).toHaveTextContent('Bears: 15'); // Bears value should now be 15

    // Step 3: Update 'bears.current' to the same value (15), should NOT trigger a re-render
    act(() => {
      store.bears.current = 15; // This should NOT trigger a re-render because the value didn't change
    });

    // Ensure the render count is still 2, meaning no additional re-render occurred
    expect(renderCountReference.count).toBe(2); // No re-render occurred when setting the same value
    expect(getByTestId('bears')).toHaveTextContent('Bears: 15'); // Bears value should still be 15
  });

  test('should update and reset object value correctly in component', () => {
    // Step 1: Initialize the store with nested values
    store.setInitial({
      books: 0,
      games: {
        educational: {
          programming: 0,
          physics: 0,
        },
        shooters: 0,
      },
    });

    // Step 2: Create a variable to track the number of renders
    let renderCount = 0;

    // Step 3: Create a test component that uses the educational games value
    const TestComponent = () => {
      renderCount += 1; // Increment render count on every render

      // Use selector to get the 'educational' games value
      const programmingGames = store.games.useCurrent(v => v.educational.programming);

      return <div data-testid='programming-games'>{`Programming Games: ${programmingGames}`}</div>;
    };

    // Step 4: Render the component for the first time
    const {getByTestId} = render(<TestComponent />);

    // Step 5: Check the initial render
    expect(renderCount).toBe(1); // Initial render
    expect(getByTestId('programming-games')).toHaveTextContent('Programming Games: 0'); // Initial state value

    // Step 6: Update the 'programming' value to 5 and confirm re-render
    act(() => {
      store.games.setCurrent(games => {
        games.educational.programming += 5;
      });
    });

    // Step 7: Assert that a re-render occurred and the new value is displayed
    expect(renderCount).toBe(2); // Re-render occurred
    expect(getByTestId('programming-games')).toHaveTextContent('Programming Games: 5'); // Updated value

    // Step 8: Reset the value and confirm reset in the component
    act(() => {
      store.games.reset();
    });

    // Step 9: Assert that another re-render occurred and the value was reset
    expect(renderCount).toBe(3); // Re-render occurred due to reset
    expect(getByTestId('programming-games')).toHaveTextContent('Programming Games: 0'); // Value reset to initial
  });
});
