import db from "../db.server";

export async function getURLRedirect(id, graphql) {
    const urlRedirect = await db.uRLRedirect.findFirst({ where: { id } });
    if (!urlRedirect) {
        return null;
    }
    return urlRedirect;
}

export async function getURLRedirects(shop, graphql) {
    const urlRedirects = await db.uRLRedirect.findMany({
        where: { shop },
        orderBy: { id: "desc" },
    });

    if (urlRedirects.length === 0) return [];
    else return urlRedirects;
}

export function validateURL(data) {
    const errors = {};
  
    if (!data.utm_source) {
      errors.utm_source = "Source is required";
    }
  
    if (!data.utm_medium) {
      errors.utm_medium = "Medium is required";
    }
  
    if (!data.utm_term) {
      errors.utm_term = "Term is required";
    }
      
    if (!data.utm_content) {
        errors.utm_content = "Content is required";
      }
    if (Object.keys(errors).length) {
      return errors;
    }
}
  