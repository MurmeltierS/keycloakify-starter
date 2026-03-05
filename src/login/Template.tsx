import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: clsx(bodyClassName ?? kcClsx("kcBodyClass"), "kosmos-body")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="kosmos-login-root">
            {/* Left side - Brand section (desktop only) */}
            <div className="kosmos-brand-panel">
                <div className="kosmos-brand-top">
                    <div className="kosmos-logo">
                        <span className="kosmos-logo-text">KOSMOS</span>
                    </div>

                    {enabledLanguages.length > 1 && (
                        <div className="kosmos-locale-desktop" id="kc-locale">
                            <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                                <div id="kc-locale-dropdown" className={clsx("menu-button-links", kcClsx("kcLocaleDropDownClass"))}>
                                    <button
                                        tabIndex={1}
                                        id="kc-current-locale-link"
                                        aria-label={msgStr("languages")}
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        aria-controls="language-switch1"
                                        className="kosmos-locale-btn"
                                    >
                                        {currentLanguage.label}
                                    </button>
                                    <ul
                                        role="menu"
                                        tabIndex={-1}
                                        aria-labelledby="kc-current-locale-link"
                                        aria-activedescendant=""
                                        id="language-switch1"
                                        className={clsx(kcClsx("kcLocaleListClass"), "kosmos-locale-list")}
                                    >
                                        {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                            <li key={languageTag} className={kcClsx("kcLocaleListItemClass")} role="none">
                                                <a role="menuitem" id={`language-${i + 1}`} className={kcClsx("kcLocaleItemClass")} href={href}>
                                                    {label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="kosmos-brand-content">
                    <h1 className="kosmos-brand-title">
                        Entdecken Sie die Welt von KOSMOS
                    </h1>
                    <p className="kosmos-brand-subtitle">
                        Bücher, Spiele und Experimentierkästen, die inspirieren und begeistern.
                        Melden Sie sich an, um Zugang zu Ihrem Konto zu erhalten.
                    </p>
                </div>

                <div className="kosmos-brand-footer">
                    <span>Spiele</span>
                    <span className="kosmos-brand-dot" />
                    <span>Bücher</span>
                    <span className="kosmos-brand-dot" />
                    <span>Experimentierkästen</span>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="kosmos-form-panel">
                {/* Mobile logo */}
                <div className="kosmos-mobile-logo">
                    <div className="kosmos-mobile-logo-box">
                        <span className="kosmos-logo-text-mobile">KOSMOS</span>
                    </div>
                </div>

                {/* Mobile locale switcher */}
                {enabledLanguages.length > 1 && (
                    <div className="kosmos-locale-mobile" id="kc-locale">
                        <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                            <div id="kc-locale-dropdown" className={clsx("menu-button-links", kcClsx("kcLocaleDropDownClass"))}>
                                <button
                                    tabIndex={1}
                                    id="kc-current-locale-link"
                                    aria-label={msgStr("languages")}
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    aria-controls="language-switch1"
                                    className="kosmos-locale-btn-mobile"
                                >
                                    {currentLanguage.label}
                                </button>
                                <ul
                                    role="menu"
                                    tabIndex={-1}
                                    aria-labelledby="kc-current-locale-link"
                                    aria-activedescendant=""
                                    id="language-switch1"
                                    className={clsx(kcClsx("kcLocaleListClass"), "kosmos-locale-list")}
                                >
                                    {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                        <li key={languageTag} className={kcClsx("kcLocaleListItemClass")} role="none">
                                            <a role="menuitem" id={`language-${i + 1}`} className={kcClsx("kcLocaleItemClass")} href={href}>
                                                {label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="kosmos-card">
                    {/* Card header */}
                    <div className="kosmos-card-header">
                        {(() => {
                            const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                <>
                                    <h2 className="kosmos-card-title">{headerNode}</h2>
                                    <p className="kosmos-card-subtitle">
                                        Melden Sie sich mit Ihren Zugangsdaten an
                                    </p>
                                </>
                            ) : (
                                <div id="kc-username" className={clsx(kcClsx("kcFormGroupClass"), "kosmos-username-display")}>
                                    <label id="kc-attempted-username" className="kosmos-attempted-username">{auth.attemptedUsername}</label>
                                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")} className="kosmos-reset-login">
                                        <div className="kc-login-tooltip">
                                            <i className={kcClsx("kcResetFlowIcon")}></i>
                                            <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                        </div>
                                    </a>
                                </div>
                            );

                            if (displayRequiredFields) {
                                return (
                                    <div className={kcClsx("kcContentWrapperClass")}>
                                        <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                            <span className="subtitle">
                                                <span className="required">*</span>
                                                {msg("requiredFields")}
                                            </span>
                                        </div>
                                        <div className="col-md-10">{node}</div>
                                    </div>
                                );
                            }

                            return node;
                        })()}
                    </div>

                    {/* Messages / Alerts */}
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <div
                            className={clsx(
                                "kosmos-alert",
                                `kosmos-alert-${message.type}`,
                                `alert-${message.type}`,
                                kcClsx("kcAlertClass"),
                                `pf-m-${message?.type === "error" ? "danger" : message.type}`
                            )}
                        >
                            <div className="kosmos-alert-icon">
                                {message.type === "success" && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                )}
                                {message.type === "warning" && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                )}
                                {message.type === "error" && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                                )}
                                {message.type === "info" && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                )}
                            </div>
                            <span
                                className="kosmos-alert-text"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(message.summary)
                                }}
                            />
                        </div>
                    )}

                    {/* Main form content */}
                    <div className="kosmos-card-content">
                        {children}

                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <a
                                        href="#"
                                        id="try-another-way"
                                        className="kosmos-try-another-way"
                                        onClick={event => {
                                            document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                            event.preventDefault();
                                            return false;
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </a>
                                </div>
                            </form>
                        )}

                        {socialProvidersNode}
                    </div>

                    {/* Registration info */}
                    {displayInfo && (
                        <div className="kosmos-card-footer">
                            <div id="kc-info" className="kosmos-info">
                                <div id="kc-info-wrapper" className="kosmos-info-wrapper">
                                    {infoNode}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
