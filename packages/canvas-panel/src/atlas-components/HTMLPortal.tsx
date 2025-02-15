import { FC, forwardRef, useLayoutEffect, useRef, render } from 'preact/compat';
import { Box, useAfterFrame, useFrame, useRuntime } from '@atlas-viewer/atlas';
import { h } from 'preact';
import { Box as BoxComponent } from '.';

export const HTMLPortal: FC<{
  backgroundColor?: string;
  interactive?: boolean;
  relative?: boolean;
  children?: any;
  target?: { x: number; y: number; width: number; height: number };
}> = forwardRef<
  Box,
  {
    backgroundColor?: string;
    interactive?: boolean;
    children?: any;
    relative?: boolean;
    target?: { x: number; y: number; width: number; height: number };
  }
>(({ children, ...props }, fwdRef) => {
  const ref = useRef<HTMLDivElement>();
  const runtime = useRuntime();
  const lastScale = useRef(0);
  const boxRef = useRef<Box>();

  useAfterFrame(() => {
    if (props.relative) {
      const relativeBox = ref.current;
      if (relativeBox && runtime) {
        const scaleFactor = runtime.getScaleFactor();
        if (lastScale.current !== scaleFactor) {
          lastScale.current = scaleFactor;
          relativeBox.style.transformOrigin = '0 0';
          relativeBox.style.transform = `scale(${1 / lastScale.current})`;
          relativeBox.style.width = `${lastScale.current * 100}%`;
          relativeBox.style.height = `${lastScale.current * 100}%`;
        }
      }
    }
  }, [props.relative]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (fwdRef && box) {
      if (typeof fwdRef === 'function') {
        (fwdRef as any)(box);
      } else {
        fwdRef.current = box;
      }
    }
    if (box && box.__host) {
      if (props.relative) {
        render(<div ref={ref as any}>{children}</div>, box.__host.element);
      } else {
        render(children as any, box.__host.element);
      }
    } else if (box) {
      box.__onCreate = () => {
        if (props.relative) {
          render(<div ref={ref as any}>{children}</div>, box.__host.element);
        } else {
          render(children as any, box.__host.element);
        }
      };
    }
  }, [fwdRef, children, boxRef, props.relative]);

  return <BoxComponent {...props} ref={boxRef} />;
});
