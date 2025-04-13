const axios = require("axios");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

/**
 * Obtain the JSON Web Key Set (JWKS) from the OIDC authority.
 * @param {string} authorityUrl the OIDC authority URL. e.g. https://login.microsoftonline.com/{tenantId}
 * @return {Promise<object[]>} the JWKS keys
 */
async function getJwks(authorityUrl) {
  try {
      const { data } = await axios.get(`${authorityUrl}/.well-known/openid-configuration`);
      const jwksUri = data.jwks_uri;

      const { data: jwks } = await axios.get(jwksUri);
      return jwks.keys;
  } catch (error) {
      console.error("Error fetching JWKS:", error);
      throw new Error("Failed to fetch JWKS");
  }
}

/**
 * Validate a JWT token using the OIDC configuration.
 * @param {*} token the JWT token
 * @param {*} authorityUrl the OIDC authority URL
 * @param {*} clientID the OIDC client ID 
 * @param {*} expectedAudience the expected audience for the token
 * @return {Promise<object>} the verified payload or an error
 */
async function validateJwt(token, authorityUrl, clientID, expectedAudience) {
  try {
      const jwks = await getJwks(authorityUrl);

      const decodedHeader = await jwt.decode(token, { complete: true });
      if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
          throw new Error("Invalid JWT: Missing key ID (kid)");
      }

      const { kid } = decodedHeader.header;
      const jwk = jwks.find((key) => key.kid === kid);
      if (!jwk) {
          throw new Error("No matching key found in JWKS");
      }

      const pubKey = jwkToPem(jwk);

      const verifiedPayload = jwt.verify(token, pubKey, {
          algorithms: ["RS256"],
          issuer: authorityUrl,
          audience: expectedAudience,
      });

      if (verifiedPayload.azp !== clientID) {
          throw new Error("JWT client ID does not match");
      }

      return { verifiedPayload };
  } catch (error) {
      const errorMessage = `JWT validation failed: ${error.message}\n`;
      console.error(errorMessage);
      return { error: errorMessage };
  }
}

/**
 * Assign roles to the user based on the role mappings provided in the jwtConfig.
 * 
 * If no role mapping is provided, the user will not have any roles assigned (i.e. user.admin = false).
 * @param {*} roleMapping the role mapping configuration
 * @param {*} payload the JWT payload
 * @param {*} user the req.user object to assign roles to
 */
function assignRoles(roleMapping, payload, user) {
    if (roleMapping) {
        for (const role of Object.keys(roleMapping)) {
            const claimValuePair = roleMapping[role];
            const claim = Object.keys(claimValuePair)[0];
            const value = claimValuePair[claim];

            if (payload[claim] && payload[claim] === value) {
                user[role] = true;
            } 
        }
    }
}

const jwtAuthHandler = () => {
  return async (req, res, next) => {
    const apiAuthMethods = require('../../config').getAPIAuthMethods();
    const jwtAuthMethod = apiAuthMethods.find((method) => method.type.toLowerCase() === "jwt");
      if (!jwtAuthMethod) {
          return next();
      }

      if (req.isAuthenticated()) {
          return next();
      }

      const token = req.header("Authorization");
      if (!token) {
          return res.status(401).send("No token provided\n");
      }

      const { clientID, authorityURL, expectedAudience, roleMapping } = jwtAuthMethod.jwtConfig;
      const audience = expectedAudience || clientID;

      if (!authorityURL) {
          return res.status(500).send("OIDC authority URL is not configured\n");
      }

      if (!clientID) {
          return res.status(500).send("OIDC client ID is not configured\n");
      }

      const tokenParts = token.split(" ");
      const { verifiedPayload, error } = await validateJwt(tokenParts[1], authorityURL, audience, clientID);
      if (error) {
          return res.status(401).send(error);
      }

      req.user = verifiedPayload;
      assignRoles(roleMapping, verifiedPayload, req.user);

      return next();
  }
}

module.exports = jwtAuthHandler;
