import './index.css';

export function Header() {
    return (
        <div className="header">
            <b>Split-shot calculator</b>
            <a
                href="https://github.com/wcoots/split-shot-calculator"
                target="_blank"
                rel="noreferrer">
                <img src="github.svg" alt="GitHub" />
            </a>
        </div>
    );
}
