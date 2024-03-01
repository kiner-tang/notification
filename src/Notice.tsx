import * as React from 'react';
import classNames from 'classnames';
import pickAttrs from 'rc-util/lib/pickAttrs';

export interface NoticeConfig {
  content?: React.ReactNode;
  duration?: number | null;
  closeIcon?: React.ReactNode;
  closable?: boolean | ({ closeIcon?: React.ReactNode } & React.AriaAttributes);
  className?: string;
  style?: React.CSSProperties;
  /** @private Internal usage. Do not override in your code */
  props?: React.HTMLAttributes<HTMLDivElement> & Record<string, any>;

  onClose?: VoidFunction;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface NoticeProps extends Omit<NoticeConfig, 'onClose'> {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  eventKey: React.Key;

  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onNoticeClose?: (key: React.Key) => void;
}

const Notify = React.forwardRef<HTMLDivElement, NoticeProps & { times?: number }>((props, ref) => {
  const {
    prefixCls,
    style,
    className,
    duration = 4.5,

    eventKey,
    content,
    closable,
    closeIcon = 'x',
    props: divProps,

    onClick,
    onNoticeClose,
    times,
  } = props;
  const [hovering, setHovering] = React.useState(false);

  // ======================== Close =========================
  const onInternalClose = () => {
    onNoticeClose(eventKey);
  };

  // ======================== Effect ========================
  React.useEffect(() => {
    if (!hovering && duration > 0) {
      const timeout = setTimeout(() => {
        onInternalClose();
      }, duration * 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [duration, hovering, times]);

  // ======================== Closable ========================
  const closableObj = React.useMemo(() => {
    if (typeof closable === 'object' && closable !== null) {
      return closable;
    }
    if (closable) {
      return { closeIcon };
    }
    return {};
  }, [closable, closeIcon]);

  const ariaProps = pickAttrs(closableObj, true);

  // ======================== Render ========================
  const noticePrefixCls = `${prefixCls}-notice`;

  return (
    <div
      {...divProps}
      ref={ref}
      className={classNames(noticePrefixCls, className, {
        [`${noticePrefixCls}-closable`]: closable,
      })}
      style={style}
      onMouseEnter={() => {
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
      onClick={onClick}
    >
      {/* Content */}
      <div className={`${noticePrefixCls}-content`}>{content}</div>

      {/* Close Icon */}
      {closable && (
        <a
          tabIndex={0}
          className={`${noticePrefixCls}-close`}
          aria-label="Close"
          {...ariaProps}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInternalClose();
          }}
        >
          {closableObj.closeIcon}
        </a>
      )}
    </div>
  );
});

export default Notify;
