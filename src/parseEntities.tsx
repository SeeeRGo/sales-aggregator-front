import { Link } from "@mui/material";
import { IMessage, TextEntityType, TextEntityTypeTextUrl } from "./types";

export const parseEntities = (message: IMessage): IMessage => {
  if (!message.entities) return message.text;
  const text = message.entities.reduceRight(
    ([source, ...rest], { offset, length, type }, i) => {
      const result = modifySubstring(source, offset, offset + length, type);
      const newRes = result.concat(rest);
      return newRes;
    },
    [message.text] as (string | JSX.Element)[]
  );

  return text;
};

const modifySubstring = (
  source: string,
  start: number,
  end: number,
  type: TextEntityType
) => {
  const preString = source.substring(0, start);
  const target = source.substring(start, end);
  const postString = source.substring(end);
  const result = [preString, parseEntity(type, target), postString];
  return result;
};

const isTextUrl = (value: TextEntityType): value is TextEntityTypeTextUrl =>
  "url" in value;

const parseEntity = (type: TextEntityType, content: string) => {
  if (isTextUrl(type)) {
    return <Link href={type.url}>{content}</Link>;
  }
  switch (type) {
    case 'textEntityTypeBold':
      return <b>{target}</b>;
    case 'textEntityTypeItalic':
      return <i>{content}</i>
    case 'textEntityTypeStrikethrough':
      return <span style={{ textDecorationLine: 'line-through' }}>{content}</span>
    case 'textEntityTypeUnderline':
      return <span style={{ textDecorationLine: 'underline' }}>{content}</span>
    default:
      return content
  }
};
