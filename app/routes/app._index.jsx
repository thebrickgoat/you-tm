import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  IndexTable,
} from "@shopify/polaris";

import { getURLRedirects } from "../models/URLRedirect.server";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const urlRedirects = await getURLRedirects(session.shop, admin.graphql);
  return json({
    urlRedirects,
  });
}

const EmptyRedirectsState = ({ onAction }) => (
  <EmptyState
    heading="Create A URL Redirect"
    action={{
      content: "Create A URL Redirect",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Create a UTM redirect for discounts and podcasts.</p>
  </EmptyState>
);

function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}


const RedirectsTable = ({ urlRedirects }) => (
  <IndexTable
    resourceName={{
      singular: "URL Redirects",
      plural: "URL Redirects",
    }}
    itemCount={urlRedirects.length}
    headings={[
      { title: "Title" },
      { title: "Source" },
      { title: "Medium" },
      { title: "Campaign" },
      { title: "Term" },
      { title: "Content" },
    ]}
    selectable={false}
  >
    {urlRedirects.map((urlRedirect) => (
      <RedirectsTableRow key={urlRedirect.id} urlRedirect={urlRedirect} />
    ))}
  </IndexTable>
);

const RedirectsTableRow = ({ urlRedirect }) => {

  return (

    <IndexTable.Row id={urlRedirect.id} position={urlRedirect.id}>
      <IndexTable.Cell>
        <Link to={`urlredirects/${urlRedirect.id}`}>{truncate(urlRedirect.title)}</Link>
      </IndexTable.Cell>
      <IndexTable.Cell>{urlRedirect.source == 'null' ? 'None' : urlRedirect.source}</IndexTable.Cell>
      <IndexTable.Cell>{urlRedirect.medium == 'null' ? 'None' : urlRedirect.medium}</IndexTable.Cell>
      <IndexTable.Cell>{urlRedirect.campaign == 'null' ? 'None' : urlRedirect.campaign}</IndexTable.Cell>
      <IndexTable.Cell>{urlRedirect.term == 'null' ? 'None' : urlRedirect.term}</IndexTable.Cell>
      <IndexTable.Cell>{urlRedirect.content == 'null' ? 'None' : urlRedirect.content}</IndexTable.Cell>
    </IndexTable.Row>
  )
};

export default function Index() {
  const { urlRedirects } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page>
      <ui-title-bar title="Current UTM URL Redirects">
        <button variant="primary" onClick={() => navigate("/app/urlredirects/new")}>
          Create URL Redirect code
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {urlRedirects.length === 0 ? (
              <EmptyRedirectsState onAction={() => navigate("urlredirects/new")} />
            ) : (
              <RedirectsTable urlRedirects={urlRedirects} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
