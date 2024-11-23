import React from "react";

export function C_Light(): JSX.Element {
  const globeWidth = 12;
  const globeHeight = 28;
  const globeSpacing = 40;
  const globeSpread = 3;
  const lightOffOpacity = 0.4;

  const styles = {
    lightrope: {
      textAlign: "center",
      whiteSpace: "nowrap" as "nowrap",
      overflow: "hidden",
      position: "absolute" as "absolute",
      zIndex: 1,
      margin: "-15px 0 0 0",
      padding: 0,
      pointerEvents: "none" as "none",
      width: "100%",
    },
    listItem: (index: number): React.CSSProperties => ({
      position: "relative",
      animationFillMode: "both",
      animationIterationCount: "infinite",
      listStyle: "none",
      margin: `${globeSpacing / 2}px`,
      padding: 0,
      display: "inline-block",
      width: `${globeWidth}px`,
      height: `${globeHeight}px`,
      borderRadius: "50%",
      background: index % 2 === 0 ? "rgba(0,247,165,1)" : "rgba(0,255,255,1)",
      boxShadow: `0px ${globeHeight / 6}px ${globeWidth * 2}px ${globeSpread}px ${
        index % 2 === 0 ? "rgba(0,247,165,1)" : "rgba(0,255,255,1)"
      }`,
      animationName: index % 4 === 2 ? "flash-3" : index % 2 === 0 ? "flash-1" : "flash-2",
      animationDuration:
        index % 4 === 2
          ? "1.1s"
          : index % 2 === 0
          ? "2s"
          : "0.4s",
    }),
  };

  return (
    <>
      <style>
        {`
          body {
            background: #000;
          }

          @keyframes flash-1 { 
            0%, 100% { 
              background: rgba(0,247,165,1);
              box-shadow: 0px ${globeHeight / 6}px ${globeWidth * 2}px ${globeSpread}px rgba(0,247,165,1);
            } 
            50% { 
              background: rgba(0,247,165,${lightOffOpacity});
              box-shadow: 0px ${globeHeight / 6}px ${globeWidth * 2}px ${globeSpread}px rgba(0,247,165,0.2);
            }
          }
          @keyframes flash-2 { 
            0%, 100% { 
              background: rgba(0,255,255,1);
              box-shadow: 0px ${globeHeight / 6}px ${globeWidth * 2}px ${globeSpread}px rgba(0,255,255,1);
            } 
            50% { 
              background: rgba(0,255,255,${lightOffOpacity});
              box-shadow: 0px ${globeHeight / 6}px ${globeWidth * 2}px ${globeSpread}px rgba(0,255,255,0.2);
            }
          }
          @keyframes flash-3 { 
            0%, 100% { 
              background: rgba(247,0,148,1);
              box-shadow: 0px ${globeHeight / 6}px ${globeWidth * 2}px ${globeSpread}px rgba(247,0,148,1);
            } 
            50% { 
              background: rgba(247,0,148,${lightOffOpacity});
              box-shadow: 0px ${globeHeight / 6}px ${globeWidth * 2}px ${globeSpread}px rgba(247,0,148,0.2);
            }
          }
        `}
      </style>

      <ul style={styles.lightrope}>
        {Array.from({ length: 20 }).map((_, index) => (
          <li key={index} style={styles.listItem(index)}>
            <span
              style={{
                content: '""',
                position: "absolute",
                background: "#222",
                width: `${globeWidth - 2}px`,
                height: `${globeHeight / 3}px`,
                borderRadius: "3px",
                top: `-${globeHeight / 6}px`,
                left: "1px",
              }}
            />
            <span
              style={{
                content: '""',
                position: "absolute",
                background: "transparent",
                top: `-${globeHeight / 2}px`,
                left: `${globeWidth - 3}px`,
                width: `${globeSpacing + 12}px`,
                height: `${(globeHeight / 3) * 2}px`,
                borderBottom: "solid #222 2px",
                borderRadius: "50%",
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
