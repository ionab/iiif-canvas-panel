import { ParsedSelector, useAnnotation, useCanvas, useResourceEvents, useStyles } from 'react-iiif-vault';
import { FC, useMemo } from 'preact/compat';
import { h } from 'preact';
import { RegionHighlight } from '../../atlas-components/RegionHighlight/RegionHighlight';
import { BoxStyle, mergeStyles } from '@atlas-viewer/atlas';

export const RenderAnnotation: FC<{ id: string; className?: string; style?: BoxStyle }> = ({
  id,
  style: defaultStyle,
  className,
}) => {
  const annotation = useAnnotation({ id });
  const style = useStyles<BoxStyle>(annotation, 'atlas');
  const html = useStyles<{ className?: string }>(annotation, 'html');
  const events = useResourceEvents(annotation as any, ['atlas']);
  const canvas = useCanvas();

  const allStyles = useMemo(() => {
    return mergeStyles(defaultStyle, style);
  }, [defaultStyle, style]);

  const isValid =
    canvas &&
    annotation &&
    annotation.target &&
    (annotation.target as any).selector &&
    (annotation.target as any).source &&
    (annotation.target as any).source.id === canvas.id;

  if (!isValid) {
    return null;
  }

  return (
    <RegionHighlight
      id={annotation.id}
      isEditing={true}
      region={(annotation.target as any).selector}
      style={allStyles}
      className={html?.className || className}
      {...events}
    />
  );
};
