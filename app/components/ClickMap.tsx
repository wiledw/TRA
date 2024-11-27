"use client";

import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ClickMap = React.forwardRef((props, ref) => {
  const [mapPoints, setMapPoints] = useState<any[]>([]);
  const [imgPosition, setImgPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const supabase = createClientComponentClient();
  const imgRef = useRef<HTMLImageElement>(null);

  // Expose methods or state to the parent via ref
  useImperativeHandle(ref, () => ({
    getMapPoints: () => mapPoints,
    clearMapPoints: () => setMapPoints([]),
  }));

  const locations = [
    { label: "CAR", xRange: [50, 53], yRange: [9, 13] },
    { label: "MAC", xRange: [57, 62], yRange: [5, 10] },
    { label: "MRS", xRange: [5, 9], yRange: [15, 19] },
    { label: "CPK", xRange: [3, 37], yRange: [19, 24] },
    { label: "YNG", xRange: [40, 44], yRange: [25, 29] },
    { label: "CUI", xRange: [55, 59], yRange: [28, 32] },
    { label: "JOR", xRange: [44, 48], yRange: [36, 40] },
    { label: "KHN", xRange: [55, 59], yRange: [36, 40] },
    { label: "MON", xRange: [65, 70], yRange: [35, 39] },
    { label: "SHE", xRange: [72, 77], yRange: [34, 39] },
    { label: "EPH", xRange: [70, 75], yRange: [39, 42] },
    { label: "COP", xRange: [77, 80], yRange: [36, 39] },
    { label: "POD", xRange: [44, 48], yRange: [43, 47] },
    { label: "KHW", xRange: [50, 54], yRange: [43, 47] },
    { label: "KHE", xRange: [60, 64], yRange: [43, 47] },
    { label: "ARC", xRange: [65, 70], yRange: [41, 45] },
    { label: "PIT", xRange: [71, 75], yRange: [43, 46] },
    { label: "RAC", xRange: [55, 59], yRange: [47, 50] },
    { label: "SLC", xRange: [39, 43], yRange: [50, 53] },
    { label: "LIB", xRange: [44, 48], yRange: [52, 56] },
    { label: "KHS", xRange: [55, 59], yRange: [51, 56] },
    { label: "RCC West", xRange: [65, 70], yRange: [51, 55] },
    { label: "RCC East", xRange: [71, 76], yRange: [51, 55] },
    { label: "ILC", xRange: [79, 83], yRange: [53, 56] },
    { label: "BKS", xRange: [43, 48], yRange: [58, 61] },
    { label: "IMC", xRange: [52, 55], yRange: [59, 61.4] },
    { label: "OKF", xRange: [56.7, 59.2], yRange: [57.7, 59.3] },
    { label: "OAK", xRange: [61.3, 63.7], yRange: [57.7, 59.5] },
    { label: "SCC", xRange: [58.7, 61.4], yRange: [58.7, 61.1] },
    { label: "PKG", xRange: [43, 48], yRange: [62, 66] },
    { label: "DSQ", xRange: [43, 48], yRange: [69, 72] },
    { label: "CED", xRange: [49, 53], yRange: [62, 66] },
    { label: "IMA", xRange: [53.4, 56.2], yRange: [61.9, 63.6] },
    { label: "HEI", xRange: [57.5, 60.1], yRange: [61.2, 63] },
    { label: "ENG", xRange: [65, 70], yRange: [61, 65] },
    { label: "MER", xRange: [70.9, 73.5], yRange: [62.3, 64.4] },
    { label: "SID", xRange: [61, 64], yRange: [64, 68] },
    { label: "DAL", xRange: [70.9, 73.6], yRange: [65.2, 67.8] },
    { label: "CIV", xRange: [73.6, 76.2], yRange: [65.7, 75.7] },
    { label: "DCC", xRange: [60, 65], yRange: [69, 73] },
    { label: "BON", xRange: [57.3, 60], yRange: [68.7, 70.7] },
    { label: "SBB", xRange: [57.3, 60], yRange: [71.4, 74] },
    { label: "BND", xRange: [53.9, 56.3], yRange: [70.1, 71.5] },
    { label: "PRO", xRange: [53.9, 56.3], yRange: [72, 73] },
    { label: "CIS", xRange: [53.9, 56.3], yRange: [73.8, 74.8] },
    { label: "VIC", xRange: [49, 53], yRange: [70, 74] },
    { label: "AOB", xRange: [31, 35], yRange: [69, 72] },
    { label: "TRS", xRange: [25, 30], yRange: [76, 81] },
    { label: "YDI", xRange: [32, 36], yRange: [75, 80] },
    { label: "TEC", xRange: [32, 36], yRange: [86, 90] },
    { label: "BTS", xRange: [24, 29], yRange: [93, 98] },
    { label: "SMH", xRange: [49, 53], yRange: [88, 92] }
  ];

  const handleClick = (event: React.MouseEvent) => {
    if (imgRef.current) {
      const img = imgRef.current;
      const rect = img.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
  
      //console.log(`Clicked at: ${xPercent.toFixed(2)}% horizontal, ${yPercent.toFixed(2)}% vertical`);
  
      locations.forEach(location => {
        if (
          xPercent >= location.xRange[0] &&
          xPercent <= location.xRange[1] &&
          yPercent >= location.yRange[0] &&
          yPercent <= location.yRange[1]
        ) {
          //console.log(location.label);
          setMapPoints(prevPoints => {
            const pointIndex = prevPoints.findIndex(point => point.label === location.label);
            let updatedPoints;
            if (pointIndex === -1) {
              updatedPoints = [...prevPoints, { label: location.label, xPercent, yPercent }];
            } else {
              updatedPoints = prevPoints.filter((_, index) => index !== pointIndex);
            }
            //console.log("Updated mapPoints:", updatedPoints);
            return updatedPoints;
          });
        }
      });
    }
  };

  const handleButtonClick = (label: string) => {
    setMapPoints(prevPoints => prevPoints.filter(point => point.label !== label));
  };

  useEffect(() => {
    const updateImgData = () => {
      if (imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        const position = { top: rect.top, left: rect.left };
        const size = { width: rect.width, height: rect.height };
        setImgPosition(position);
        setImgSize(size);

        //console.log(`Image Position - Top: ${position.top}px, Left: ${position.left}px`);
        //console.log(`Image Size - Width: ${size.width}px, Height: ${size.height}px`);
      }
    };

    updateImgData();

    window.addEventListener("resize", updateImgData);

    return () => {
      window.removeEventListener("resize", updateImgData);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center h-screen">
      <img
        ref={imgRef}
        src="/campus_map.png"
        alt="Map"
        width={800}
        height={600}
        className="rounded-md shadow-lg"
        style={{ position: "absolute" }}
        onClick={handleClick}
      />
      {mapPoints.map((point, index) => (
        <button
          key={index}
          className="absolute"
          style={{
            left: `${(imgSize.width * (point.xPercent / 100)) + imgPosition.left}px`,
            top: `${(imgSize.height * (point.yPercent / 100)) + imgPosition.top - 64}px`, //64 is the create_post page padding offset
            transform: "translate(-50%, -50%)",
            width: "20px", // You can adjust the size of the ping
            height: "20px", // Make it the same as width for a circular shape
            borderRadius: "50%", // This ensures the button is circular
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            color: "rgba(255, 255, 255, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            transition: "transform 0.2s ease-in-out", // Optional: for smooth scaling on hover
          }}
          onClick={() => handleButtonClick(point.label)}
        />
      ))}
    </div>
  );
});

ClickMap.displayName = 'ClickMap';

export default ClickMap;