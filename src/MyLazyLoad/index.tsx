import {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface MyLazyLoadProps {
  className?: string;
  style?: CSSProperties;
  placeholder?: ReactNode;
  offset?: number | string;
  width?: number | string;
  height?: number | string;
  children?: ReactNode;
  onContentVisible?: () => void;
}

const MyLazyLoad: FC<MyLazyLoadProps> = (props) => {
  const {
    className = "",
    style,
    offset = 0,
    width,
    onContentVisible,
    placeholder,
    height,
    children,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const elementObserve = useRef<IntersectionObserver>();

  function lazyLoadHandler(entries: IntersectionObserverEntry[]) {
    const [entry] = entries;
    const { isIntersecting } = entry;

    if (isIntersecting) {
      setVisible(true);
      onContentVisible && onContentVisible();

      const node = containerRef.current;
      if (node && node instanceof HTMLElement) {
        elementObserve.current?.unobserve(node);
      }
    }
  }

  useEffect(() => {
    const options = {
      rootMargin: typeof offset === "number" ? `${offset}px` : offset || "0px",
      threshold: 0,
    };

    elementObserve.current = new IntersectionObserver(lazyLoadHandler, options);

    const node = containerRef.current;

    if (node instanceof HTMLElement) {
      elementObserve.current.observe(node);
    }

    return () => {
      if (node && node instanceof HTMLElement) {
        elementObserve.current?.unobserve(node);
      }
    };
  });

  const styles = {
    width,
    height,
    ...style,
  };

  return (
    <>
      <div ref={containerRef} className={className} style={styles}>
        {visible ? children : placeholder}
      </div>
    </>
  );
};

export default MyLazyLoad;
