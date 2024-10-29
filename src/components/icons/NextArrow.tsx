import * as React from "react"
import { SVGProps } from "react"
const NextArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={43}
    height={43}
    fill="none"
    {...props}
  >
    <path
      fill="#B98A3D"
      d="m28.113 23.06-8.25 8.25a1.325 1.325 0 0 1-1.933 0 1.325 1.325 0 0 1 0-1.933l7.261-7.262-7.261-7.305a1.325 1.325 0 0 1 0-1.934 1.325 1.325 0 0 1 1.933 0l8.25 8.25a1.325 1.325 0 0 1 0 1.934Z"
    />
  </svg>
)
export default NextArrow
