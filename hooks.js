function useThrottle(value, delay) {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastExecuted = useRef(0);
  
    useEffect(() => {
      const now = Date.now();
      if (now - lastExecuted.current >= delay) {
        setThrottledValue(value);
        lastExecuted.current = now;
      }
    }, [value, delay]);
  
    return throttledValue;
}


import { useRef, useEffect } from "react";

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value; // Update ref to the current value on every render
  }, [value]); // Trigger effect whenever the value changes

  return ref.current; // Return the previous value (before the most recent render)
}


function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      // Set a timeout to update the debounced value
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cleanup function to clear the timeout if value or delay changes
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]); // Re-run effect if value or delay changes
  
    return debouncedValue;
  }


  function useWindowSize() {
    const [size, setSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  
    useEffect(() => {
      const handleResize = () => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return size;
  }