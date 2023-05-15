import { Link } from "@mui/material";
import { IMessage, TextEntityType } from "./types";

export const parseEntities = (message: IMessage): (string | JSX.Element)[] => {
  if (!message.entities) return [message.text];
  const text = message.entities.reduceRight(
    ([source, ...rest], { offset, length, className, url }, i) => {
      const result = modifySubstring(source, offset, offset + length, className, url);
      const newRes = result.concat(rest);
      return newRes;
    },
    [message.text] as (string | JSX.Element)[]
  );

  return text;
};

const modifySubstring = (
  source: string | JSX.Element,
  start: number,
  end: number,
  type: TextEntityType,
  url?: string,
) => {
  if (typeof source === 'string') {
    const preString = source.substring(0, start);
    const target = source.substring(start, end);
    const postString = source.substring(end);
    const result = [preString, parseEntity(type, target, url), postString];
    return result;
  }
  return [source];
};

const parseEntity = (type: TextEntityType, content: string, url?: string) => {
  if (url) {
    return <Link href={url}>{content}</Link>;
  }
  switch (type) {
    case 'MessageEntityBold':
      return <b>{content}</b>;
    case 'MessageEntityItalic':
      return <i>{content}</i>
    case 'MessageEntityStrikethrough':
      return <span style={{ textDecorationLine: 'line-through' }}>{content}</span>
    case 'MessageEntityUnderline':
      return <span style={{ textDecorationLine: 'underline' }}>{content}</span>
    default:
      return content
  }
};
