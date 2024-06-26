import {getProxyByKeys} from "./api/webpack";
import {React} from "./api/webpack/common";

const markdownWrapper = getProxyByKeys<{
    parse(text: string, state?: Record<PropertyKey, any>): React.ReactNode
}>(["parse", "defaultRules", "parseTopic"]);

export function Markdown(props: { text: string, state?: Record<PropertyKey, any> }) {
    const parsed = React.useMemo(() => {
        return markdownWrapper.parse(props.text, props.state);
    }, [props.text, props.state]);

    return <>{parsed}</>;
}

export function transformContent(content: React.ReactNode | React.ReactNode[], lineClassName: string) {
    return React.Children.map(content, (child) => {
        if (typeof child === "string") return (
            <div className={lineClassName}>
                <Markdown text={child}/>
            </div>
        )

        return (
            <div className={lineClassName}>
                {child}
            </div>
        )
    });
}