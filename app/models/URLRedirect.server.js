import db from "../db.server";

export async function getURLRedirect(id) {
    const urlRedirect = await db.uRLRedirect.findFirst({ where: { id } });
    if (!urlRedirect) {
        return null;
    }
    return urlRedirect;
}

export async function getURLRedirects(shop) {
    const urlRedirects = await db.uRLRedirect.findMany({
        where: { shop },
        orderBy: { id: "desc" },
    });
    if (urlRedirects.length === 0) return [];
    else return urlRedirects;
}

export async function createURLRedirect(data, shop, graphql) {
    console.log(data)

    const response = await graphql(
        `
        mutation urlRedirectCreate($urlRedirect: UrlRedirectInput!) {
            urlRedirectCreate(urlRedirect: $urlRedirect) {
              urlRedirect {
                path
                target
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
            variables: {
                "urlRedirect": {
                    "path": data.url,
                    "target": `/${data.targetPage}`
                }
            },
        }
    );
    console.log(response);
    return response.json();

}

export async function deleteURLRedirect(id, shop, graphql) {

}

export function validateURL(data) {
    const errors = {};
    if (!data.title) {
        errors.title = "Please provide a title";
    }
    if (!data.sourcePage) {
        errors.url = "Please provide a source page";
    }
    if (data.source == 'null' && data.medium == 'null' && data.campaign == 'null' && data.term == 'null' && data.content == 'null') {
        errors.paramater = "At least one UTM Parameter is required";
    }
    if (Object.keys(errors).length) {
        return errors;
    }
}
