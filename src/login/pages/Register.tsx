import { useState, useLayoutEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { JSX } from "keycloakify/tools/JSX";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const {
        messageHeader,
        url,
        messagesPerField,
        recaptchaRequired,
        recaptchaVisible,
        recaptchaSiteKey,
        recaptchaAction,
        termsAcceptanceRequired
    } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    useLayoutEffect(() => {
        (window as Record<string, any>)["onSubmitRecaptcha"] = () => {
            // @ts-expect-error
            document.getElementById("kc-register-form").requestSubmit();
        };
        return () => {
            delete (window as Record<string, any>)["onSubmitRecaptcha"];
        };
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
        >
            <form
                id="kc-register-form"
                className={clsx(kcClsx("kcFormClass"), "kosmos-register-form")}
                action={url.registrationAction}
                method="post"
            >
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
                {termsAcceptanceRequired && (
                    <TermsAcceptance
                        i18n={i18n}
                        kcClsx={kcClsx}
                        messagesPerField={messagesPerField}
                        areTermsAccepted={areTermsAccepted}
                        onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                )}
                {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <div className="kosmos-form-group">
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                        </div>
                    </div>
                )}

                <div className={clsx(kcClsx("kcFormGroupClass"), "kosmos-form-buttons")}>
                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                        <button
                            className={clsx(
                                kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                                "kosmos-submit-btn",
                                "g-recaptcha"
                            )}
                            data-sitekey={recaptchaSiteKey}
                            data-callback="onSubmitRecaptcha"
                            data-action={recaptchaAction}
                            type="submit"
                        >
                            {msg("doRegister")}
                        </button>
                    ) : (
                        <input
                            disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                            className={clsx(
                                kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                                "kosmos-submit-btn"
                            )}
                            type="submit"
                            value={msgStr("doRegister")}
                        />
                    )}
                </div>

                <div className="kosmos-register-footer">
                    <a href={url.loginUrl} className="kosmos-back-to-login">
                        {msg("backToLogin")}
                    </a>
                </div>
            </form>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, kcClsx, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

    const { msg } = i18n;

    return (
        <>
            <div className="kosmos-terms">
                <div className="kosmos-terms-title">{msg("termsTitle")}</div>
                <div id="kc-registration-terms-text" className="kosmos-terms-text">
                    {msg("termsText")}
                </div>
            </div>
            <div className="kosmos-form-group">
                <div className="kosmos-checkbox-wrapper">
                    <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        className="kosmos-checkbox"
                        checked={areTermsAccepted}
                        onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                        aria-invalid={messagesPerField.existsError("termsAccepted")}
                    />
                    <label htmlFor="termsAccepted" className="kosmos-checkbox-label">
                        {msg("acceptTerms")}
                    </label>
                </div>
                {messagesPerField.existsError("termsAccepted") && (
                    <span
                        id="input-error-terms-accepted"
                        className={clsx(kcClsx("kcInputErrorMessageClass"), "kosmos-error")}
                        aria-live="polite"
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(messagesPerField.get("termsAccepted"))
                        }}
                    />
                )}
            </div>
        </>
    );
}
