import React from "react";

import { useVirtualizer } from "@tanstack/react-virtual";
import { IMessage } from "@/types";
import { FormattedMessage } from "@/components/FormattedMessage";

interface IProps {
  rows: IMessage[]
}

export function MasonryVerticalVirtualizerVariable({ rows }: IProps) {
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef?.current,
    estimateSize: (i) => 150,
    overscan: 5,
    lanes: 4,
  });

  return (
    <>
      <div
        ref={parentRef}
        style={{
          height: `1000px`,
          width: `100%`,
          overflow: "auto",
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${virtualRow.lane * 25}%`,
                  width: "25%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <FormattedMessage message={rows[virtualRow.index]} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
