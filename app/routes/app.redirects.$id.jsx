import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import {
    useActionData,
    useLoaderData,
    useNavigation,
    useSubmit,
    useNavigate,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
    Card,
    Layout,
    Page,
    Text,
    TextField,
    BlockStack,
    PageActions,
} from "@shopify/polaris";

import db from "../db.server";
import { getURLRedirect, validateURL } from "../models/URLRedirect.server";

export async function loader({ request, params }) {
    const { admin } = await authenticate.admin(request);
    if (params.id === "new") {
        return json({
            destination: "product",
            title: "",
        });
    }

    return json(await getURLRedirect(Number(params.id), admin.graphql));
}

export async function action({ request, params }) {
    const { session } = await authenticate.admin(request);
    const { shop } = session;

    const data = {
        ...Object.fromEntries(await request.formData()),
        shop,
    };

    if (data.action === "delete") {
        await db.uRLRedirect.delete({ where: { id: Number(params.id) } });
        return redirect("/app");
    }

    const errors = validateURL(data);

    if (errors) {
        return json({ errors }, { status: 422 });
    }

    const urlRedirect =
        params.id === "new"
            ? await db.uRLRedirect.create({ data })
            : await db.uRLRedirect.update({ where: { id: Number(params.id) }, data });

    return redirect(`/app/urlredirects/${urlRedirect.id}`);
}

export default function URLRedirectForm() {
    const errors = useActionData()?.errors || {};
    const urlRedirect = useLoaderData();
    const [formState, setFormState] = useState(urlRedirect);
    const [cleanFormState, setCleanFormState] = useState(urlRedirect);
    const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);

    const nav = useNavigation();
    const isSaving =
        nav.state === "submitting" && nav.formData?.get("action") !== "delete";
    const isDeleting =
        nav.state === "submitting" && nav.formData?.get("action") === "delete";

    const navigate = useNavigate();

    const submit = useSubmit();
    function handleSave() {
        console.log('fire')
        let url
        if (formState.discount !== "" && formState.discount !== undefined) {
            url = `https://${shop}/discount/${formState.discount}?utm+source=${formState.source}&utm+medium=${formState.medium}&utm+campaign=${formState.campaign}&utm+term=${formState.term}&utm+content=${formState.content}&redirect=${formState.page}`;
        }
        else {
            url = `https://${shop}/${formState.page}?utm+source=${formState.source}&utm+medium=${formState.medium}&utm+campaign=${formState.campaign}&utm+term=${formState.term}&utm+content=${formState.content}`;
        }
        console.log(url)

        const data = {
            title: formState.title,
            url: url,
            source: formState.source || "",
            medium: formState.medium  || "",
            campaign: formState.campaign || "",
            term: formState.term || "",
            content: formState.content || "", 
            discount: formState.discount || "",
            page: formState.page,
        };
        console.log(data)

        setCleanFormState({ ...formState });
        submit(data, { method: "post" });
    }

    return (
        <Page>
            <ui-title-bar title={urlRedirect.id ? "Edit URL Redirect" : "Create New URL Redirect"}>
                <button variant="breadcrumb" onClick={() => navigate("/app")}>
                    URL Redirects
                </button>
            </ui-title-bar>
            <Layout>
                <Layout.Section>
                    <BlockStack gap="500">

                        <Card>
                            <BlockStack gap="500">
                                {urlRedirect.id && (
                                    <Text as={"h2"} variant="headingLg">
                                        {urlRedirect.url}
                                    </Text>
                                )}
                                <BlockStack gap="300">
                                    <Text as={"h2"} variant="headingLg">
                                        Title
                                    </Text>
                                    <TextField
                                        id="title"
                                        helpText="Only store staff can see this title"
                                        label="title"
                                        labelHidden
                                        autoComplete="off"
                                        value={formState.title}
                                        onChange={(title) => setFormState({ ...formState, title })}
                                        error={errors.title}
                                    />
                                </BlockStack>
                                <BlockStack gap="300">
                                    <Text as={"h2"} variant="headingLg">
                                        Page
                                    </Text>
                                    <TextField
                                        id="page"
                                        helpText="Page you want the redirect to go to"
                                        label="page"
                                        labelHidden
                                        autoComplete="off"
                                        value={formState.page}
                                        onChange={(page) => setFormState({ ...formState, page })}
                                        error={errors.page}
                                    />
                                </BlockStack>
                                <BlockStack gap="300">
                                    <Text as={"h2"} variant="headingLg">
                                        Discount Code
                                    </Text>
                                    <TextField
                                        id="discount"
                                        helpText="Discount code you want to use to be automatically applied to the link. If you do not want to use a discount code automatically, leave this field blank."
                                        label="discount"
                                        labelHidden
                                        autoComplete="off"
                                        value={formState.discount}
                                        onChange={(discount) => setFormState({ ...formState, discount })}
                                        error={errors.discount}
                                    />
                                </BlockStack>
                            </BlockStack>

                        </Card>
                        <Card>
                            <BlockStack gap="500">
                                <BlockStack gap="300">

                                    <Text as={"h2"} variant="headingLg">
                                        Source
                                    </Text>
                                    <TextField
                                        id="source"
                                        label="Source"
                                        labelHidden
                                        autoComplete="off"
                                        value={formState.source}
                                        onChange={(source) => setFormState({ ...formState, source })}
                                        error={errors.source}
                                    />

                                </BlockStack>

                                <BlockStack gap="300">
                                    <Text as={"h2"} variant="headingLg">
                                        Medium
                                    </Text>
                                    <TextField
                                        id="medium"
                                        label="Medium"
                                        labelHidden
                                        autoComplete="off"
                                        value={formState.medium}
                                        onChange={(medium) => setFormState({ ...formState, medium })}
                                        error={errors.medium}
                                    />
                                </BlockStack>

                                <BlockStack gap="300">
                                    <Text as={"h2"} variant="headingLg">
                                        Campaign
                                    </Text>
                                    <TextField
                                        id="campaign"
                                        label="Campaign"
                                        labelHidden
                                        autoComplete="off"
                                        value={formState.campaign}
                                        onChange={(campaign) => setFormState({ ...formState, campaign })}
                                        error={errors.campaign}
                                    />
                                </BlockStack>
                                <BlockStack gap="300">
                                    <Text as={"h2"} variant="headingLg">
                                        Term
                                    </Text>
                                    <TextField
                                        id="term"
                                        label="Term"
                                        labelHidden
                                        autoComplete="off"
                                        value={formState.term}
                                        onChange={(term) => setFormState({ ...formState, term })}
                                        error={errors.term}
                                    />
                                </BlockStack>
                                <BlockStack gap="300">
                                    <Text as={"h2"} variant="headingLg">
                                        Content
                                    </Text>
                                    <TextField
                                        id="content"
                                        label="Content"
                                        labelHidden
                                        autoComplete="off"
                                        value={formState.content}
                                        onChange={(content) => setFormState({ ...formState, content })}
                                        error={errors.content}
                                    />
                                </BlockStack>
                            </BlockStack>

                        </Card>
                    </BlockStack>
                </Layout.Section>
                <Layout.Section>
                    <PageActions
                        secondaryActions={[
                            {
                                content: "Delete",
                                loading: isDeleting,
                                disabled: !urlRedirect.id || !urlRedirect || isSaving || isDeleting,
                                destructive: true,
                                outline: true,
                                onAction: () =>
                                    submit({ action: "delete" }, { method: "post" }),
                            },
                        ]}
                        primaryAction={{
                            content: "Save",
                            loading: isSaving,
                            disabled: !isDirty || isSaving || isDeleting,
                            onAction: handleSave,
                        }}
                    />
                </Layout.Section>
            </Layout>
        </Page>
    );
}