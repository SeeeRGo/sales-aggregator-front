import React, { useMemo } from "react";

import { defaultRangeExtractor, useVirtualizer } from "@tanstack/react-virtual";
import { IMessage } from "@/types";
import { FormattedMessage } from "@/components/FormattedMessage";
import { Grid } from "@mui/material";
import dayjs from "dayjs";
import { getTimeWindowText } from "@/utils";

interface IProps {
  rows: IMessage[];
  headerText: string;
  setHeaderText: (newText: string) => void
}

export function RowVirtualizerDynamic({ rows, headerText, setHeaderText }: IProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const slicedRows = useMemo(() => {
    const result = [];
    for (let i = 0; i * 4 < rows.length; i++) {
      const slice = rows.slice(i * 4, i * 4 + 4);
      result.push(slice);
    }
    return result;
  }, [rows]);
  // console.log('slicedRows', slicedRows);

  const count = Math.floor(rows.length / 4) + 1;
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    rangeExtractor: (range) => {
      const firstMessageInRange = slicedRows.at(range.startIndex)?.at(0)
      if (firstMessageInRange) {
        const firstDatesInRange = firstMessageInRange.date;
        const newHeaderText = getTimeWindowText(firstDatesInRange);
        if (headerText !== newHeaderText) {
          setHeaderText(newHeaderText)
        }
      }
      
      const result = defaultRangeExtractor(range)
      return result
    }
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div>
      <div
        ref={parentRef}
        style={{
          height: "calc(100vh - 120px)",
          width: "100%",
          overflowY: "auto",
          contain: "strict",
        }}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${items[0].start}px)`,
            }}
          >
            {items.map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
              >
                <div style={{ padding: "10px 0" }}>
                  {slicedRows[virtualRow.index] && (
                    <Grid container columnSpacing={2} rowSpacing={2}>
                      {slicedRows[virtualRow.index].map((message, i) =>
                        {
                          return (
                            <Grid item xs={3} key={i}>
                              <FormattedMessage message={message} />
                            </Grid>
                          );
                            
                        }
                      )}
                    </Grid>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
