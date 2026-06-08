import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
    title: "login/register.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithTermsAcceptance: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                termsAcceptanceRequired: true
            }}
        />
    )
};

export const WithRecaptcha: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                recaptchaRequired: true,
                recaptchaVisible: true,
                recaptchaSiteKey: "foobar"
            }}
        />
    )
};
