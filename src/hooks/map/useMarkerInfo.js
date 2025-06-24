
import { useEffect, useState } from "react";

export default function useMarkerInfo(markerCounts) {
  const [pointerCount, setPointerCount] = useState(0);
  const [pathsCount, setPathsCount] = useState(0);
  const [pointerOptions, setPointerOptions] = useState([]);
  const [pathOptions, setPathOptions] = useState([]);

  useEffect(() => {
    const pointers = [];
    const paths = [];

    if (markerCounts > 1) {
      setPointerCount(markerCounts);
      setPathsCount(markerCounts - 1);
    } else {
      setPointerCount(markerCounts);
      setPathsCount(0);
    }
 
    // pointer - path -pointer - path 순서... -> pointer는 순서대로 2n-1 수열 형태 / path는 2n 수열 형태

    for (let i = 0; i < markerCounts; i++) {
      const orderKey = 1 + i * 2; // 1, 3, 5, ...
      pointers.push({
        key: orderKey,
        value: `${i + 1}`,
      });
    }

    for (let i = 0; i < Math.max(0, markerCounts - 1); i++) {
      const orderKey = 2 + i * 2; // 2, 4, 6, ...
      paths.push({
        key: orderKey,
        value: `${i + 1}-${i + 2}`,
      });
    }

    setPointerOptions(pointers);
    setPathOptions(paths);
  }, [markerCounts]);

  return {
    pointerCount,
    pathsCount,
    pointerOptions, // [{ key: 1, value: '1' }, ...]
    pathOptions,    // [{ key: 2, value: '1-2' }, ...]
  };
}
