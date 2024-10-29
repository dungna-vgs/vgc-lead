import * as React from "react"
import { SVGProps } from "react"
const BackArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={42}
    height={42}
    fill="none"
    {...props}
  >
    <path
      fill="#F9EBAB"
      d="m14.387 19.805 8.25-8.25a1.325 1.325 0 0 1 1.933 0 1.325 1.325 0 0 1 0 1.933L17.31 20.75l7.261 7.305a1.325 1.325 0 0 1 0 1.933 1.325 1.325 0 0 1-1.933 0l-8.25-8.25a1.325 1.325 0 0 1 0-1.933Z"
    />
  </svg>
)
export default BackArrow
