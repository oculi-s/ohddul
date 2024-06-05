import cn from "classnames";

export const Inner = ({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn("w-full max-w-content px-5 mx-auto", className)}{...rest}></div>
    )
}