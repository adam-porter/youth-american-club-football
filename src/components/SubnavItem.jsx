import React from 'react'

const SubnavItem = ({
  className = '',
  label,
  active = false,
  hasPill = false,
  pillText = '',
  onClick,
  ...rest
}) => {
  const classes = [
    'subnav-item',
    active && 'subnav-item--active',
    hasPill && 'subnav-item--has-pill',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <style>
        {`
          .subnav-item {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-200, 14px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
            height: 36px;
            padding: 0 var(--u-space-three-quarter, 12px);
            border-radius: var(--u-border-radius-large, 8px);
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            border: none;
            background-color: transparent;
            color: var(--u-color-base-foreground, #36485c);
            text-align: left;
            width: 100%;
          }

          .subnav-item:hover {
            background-color: var(--u-color-base-background, #e0e1e1);
            color: var(--u-color-base-foreground-contrast, #071c31);
          }

          .subnav-item--active {
            background-color: var(--u-color-emphasis-background-active, #96ccf3);
            color: var(--u-color-emphasis-foreground-contrast, #0d3673);
          }

          .subnav-item-label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .subnav-item-pill {
            height: 24px;
            padding: var(--u-space-eighth, 2px) var(--u-space-half, 8px);
            border-radius: var(--u-border-radius-large, 8px);
            background-color: var(--u-color-background-container, #fefefe);
            font-size: var(--u-font-size-micro, 12px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground-subtle, #6c757d);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-left: var(--u-space-half, 8px);
          }

          .subnav-item--active .subnav-item-pill {
            color: var(--u-color-emphasis-foreground-contrast, #0d3673);
          }
        `}
      </style>
      <button
        type="button"
        className={classes}
        onClick={onClick}
        {...rest}
      >
        <span className="subnav-item-label">{label}</span>
        {hasPill && pillText ? (
          <span className="subnav-item-pill">{pillText}</span>
        ) : null}
      </button>
    </>
  )
}

export default SubnavItem


