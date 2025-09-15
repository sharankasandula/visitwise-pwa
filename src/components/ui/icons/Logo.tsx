import React from "react";
import { cn } from "../../../utils/cn";

interface LogoProps {
  /**
   * The size of the logo
   * @default "default"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "default";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * The color variant of the logo
   * @default "default"
   */
  variant?: "default" | "white" | "primary" | "secondary" | "muted" | "accent";
  /**
   * Whether to show the text alongside the icon
   * @default true
   */
  showText?: boolean;
  /**
   * Custom width and height for the logo
   */
  width?: number | string;
  height?: number | string;
  /**
   * Custom SVG content to display (overrides default logo)
   */
  children?: React.ReactNode;
}

const sizeClasses = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20",
  default: "h-10 w-10",
};

const textSizeClasses = {
  xs: "text-sm font-medium",
  sm: "text-md font-medium",
  md: "text-lg font-medium",
  lg: "text-3xl font-medium",
  xl: "text-2xl font-medium",
  "2xl": "text-3xl font-medium",
  default: "text-lg font-medium",
};

const variantClasses = {
  default: {
    fill: "fill-foreground",
    stroke: "stroke-foreground",
    text: "text-foreground",
  },
  white: {
    fill: "fill-white",
    stroke: "stroke-white",
    text: "text-white",
  },
  primary: {
    fill: "fill-primary",
    stroke: "stroke-primary",
    text: "text-primary",
  },
  secondary: {
    fill: "fill-secondary",
    stroke: "stroke-secondary",
    text: "text-secondary",
  },
  muted: {
    fill: "fill-muted-foreground",
    stroke: "stroke-muted-foreground",
    text: "text-muted-foreground",
  },
  accent: {
    fill: "fill-accent",
    stroke: "stroke-accent",
    text: "text-accent",
  },
};

export const Logo: React.FC<LogoProps> = ({
  size = "default",
  className,
  variant = "default",
  showText = true,
  width,
  height,
  children,
}) => {
  const currentVariant = variantClasses[variant];

  // Always apply size classes for proper sizing
  const logoClasses = cn(sizeClasses[size], className);

  const textClasses = cn(
    "font-semibold font-sans",
    textSizeClasses[size],
    currentVariant.text
  );

  // Custom dimensions style - override Tailwind classes when provided
  const customDimensions = {
    ...(width && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height && {
      height: typeof height === "number" ? `${height}px` : height,
    }),
  };

  return (
    <div className="flex items-center gap-2">
      <svg
        className={logoClasses}
        style={customDimensions}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 610 599"
        aria-label="Visitwise"
        preserveAspectRatio="xMidYMid meet"
      >
        {children || (
          <g
            transform="translate(0,599) scale(0.1,-0.1)"
            className={cn(currentVariant.fill, currentVariant.stroke)}
            strokeWidth="28"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          >
            <path
              d="M1395 5905 c-69 -33 -128 -93 -161 -162 -24 -49 -28 -71 -28 -143 0
-74 4 -93 29 -143 51 -103 128 -163 240 -188 139 -30 298 48 367 181 20 39 23
59 23 150 0 103 -1 107 -35 164 -69 115 -161 166 -298 166 -71 -1 -96 -5 -137
-25z"
            />
            <path
              d="M410 5163 c-188 -22 -366 -55 -383 -72 -6 -6 14 -14 49 -21 545 -109
1022 -360 1313 -691 42 -47 85 -98 96 -113 11 -16 34 -47 52 -70 74 -100 182
-298 286 -526 13 -30 38 -84 55 -120 16 -36 40 -87 52 -115 13 -27 43 -93 67
-145 24 -52 52 -111 60 -130 9 -19 38 -81 64 -137 27 -56 49 -104 49 -107 0
-2 25 -56 55 -121 30 -64 55 -118 55 -120 0 -2 20 -48 45 -101 25 -53 45 -97
45 -99 0 -2 25 -55 55 -120 30 -64 55 -118 55 -120 0 -2 21 -48 46 -102 180
-379 221 -449 328 -553 75 -73 172 -142 194 -138 7 2 25 30 38 63 13 33 28 69
34 80 5 11 23 54 39 95 55 143 299 736 332 807 10 24 19 45 19 48 0 5 114 289
140 350 5 11 36 88 70 170 33 83 65 159 70 170 5 11 35 83 66 160 139 345 208
514 289 710 48 116 100 242 115 280 103 257 127 321 123 328 -15 25 -185 -18
-291 -74 -192 -102 -350 -287 -453 -529 -17 -41 -39 -93 -49 -115 -9 -22 -22
-53 -28 -70 -10 -26 -153 -394 -252 -645 -42 -108 -114 -297 -135 -355 -10
-27 -22 -54 -25 -60 -6 -8 -92 -232 -172 -447 -6 -16 -16 -28 -22 -28 -6 0
-25 30 -40 68 -16 37 -51 114 -78 171 -26 57 -48 105 -48 107 0 2 -14 34 -31
71 -17 38 -50 111 -74 163 -24 52 -57 127 -75 165 -68 148 -80 174 -133 295
-30 69 -71 160 -91 203 -20 42 -36 79 -36 82 0 2 -11 28 -25 57 -13 29 -60
133 -103 230 -44 97 -105 223 -137 279 -142 250 -387 516 -585 633 -86 51
-285 144 -363 170 -231 76 -526 112 -727 89z"
            />
            <path
              d="M5575 5053 c-147 -33 -209 -59 -321 -135 -79 -54 -175 -150 -248
-248 -41 -55 -151 -263 -193 -366 -6 -16 -32 -76 -56 -134 -25 -58 -88 -211
-142 -340 -53 -129 -103 -249 -110 -265 -8 -17 -39 -93 -70 -170 -60 -147
-130 -316 -145 -350 -40 -90 -60 -136 -60 -140 0 -2 -70 -173 -155 -380 -85
-207 -155 -379 -155 -382 0 -3 -7 -19 -15 -36 -8 -18 -39 -90 -68 -162 -30
-71 -89 -213 -131 -314 -90 -214 -101 -275 -71 -386 34 -128 119 -226 248
-284 80 -36 77 -38 134 99 8 19 23 55 34 79 11 24 81 192 155 375 74 182 139
340 144 351 10 21 145 354 248 610 58 143 107 264 226 558 30 72 73 177 96
232 23 55 45 109 50 120 4 11 20 48 34 81 14 34 26 64 26 68 0 3 9 25 19 49
29 63 341 825 341 832 0 3 9 25 20 49 10 24 51 123 90 222 76 191 82 205 98
244 53 128 51 140 -23 123z"
            />
            <path
              d="M485 4538 c11 -37 328 -816 355 -873 6 -11 33 -76 61 -145 28 -69 75
-186 106 -260 30 -74 69 -169 85 -210 17 -41 36 -88 43 -105 14 -31 150 -369
205 -510 17 -44 36 -89 42 -99 6 -11 21 -47 33 -80 28 -74 82 -214 94 -241 5
-11 14 -33 21 -50 7 -16 16 -39 21 -50 4 -11 40 -87 80 -170 254 -528 680
-979 1208 -1277 47 -27 269 -138 275 -138 3 0 29 -11 58 -24 29 -13 71 -30 93
-37 22 -7 45 -16 50 -20 12 -7 246 -81 325 -102 30 -9 75 -21 100 -27 89 -24
313 -57 485 -71 169 -14 547 -6 690 15 55 8 120 17 145 21 71 10 211 35 255
45 183 43 277 69 385 105 154 53 308 113 335 131 18 13 17 14 -15 14 -19 0
-64 -5 -100 -10 -294 -45 -387 -52 -700 -53 -240 -1 -352 3 -470 16 -154 17
-177 21 -360 53 -236 40 -611 151 -790 232 -234 105 -370 179 -560 301 -180
115 -418 330 -603 544 -71 82 -217 291 -268 382 -32 59 -111 218 -154 310 -57
125 -56 122 -204 455 -137 310 -165 372 -262 579 -27 57 -49 106 -49 108 0 3
-47 99 -105 215 -183 365 -281 516 -476 730 -96 106 -380 318 -427 318 -9 0
-11 -7 -7 -22z"
            />
          </g>
        )}
      </svg>

      {showText && (
        <span className={`${textClasses} font-pacifico brand-heading`}>
          Visitwise
        </span>
      )}
    </div>
  );
};

export default Logo;
