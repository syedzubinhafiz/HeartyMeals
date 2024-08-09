import {
    authorizationCodeGrantRequest,
    calculatePKCECodeChallenge,
    type Client,
    discoveryRequest,
    generateRandomCodeVerifier,
    getValidatedIdTokenClaims,
    isOAuth2Error,
    parseWwwAuthenticateChallenges,
    processAuthorizationCodeOpenIDResponse,
    processDiscoveryResponse,
    processUserInfoResponse,
    userInfoRequest,
    validateAuthResponse,
    skipSubjectCheck,
    type UserInfoResponse,
  } from "oauth4webapi";
  
  export interface AuthorizationUrlAndCodeVerifier {
    authorizationUrl: URL;
    codeVerifier: string;
  }
  
  export interface AccessTokenAndClaims {
    accessToken: string;
    claims: any;
  }
  
  export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig();
    const issuerUrl = new URL(config.public.greensheartAccountsIssuer as string);
    const discoveryResponse = await discoveryRequest(issuerUrl, {
      algorithm: "oidc",
    });
    const authorizationServer = await processDiscoveryResponse(
      new URL(config.public.greensheartAccountsIssuer as string),
      discoveryResponse,
    );
  
    const client: Client = {
      client_id: config.public.greensheartAccountsClientId as string,
      token_endpoint_auth_method: "none",
    };
  
    return {
      provide: {
        oauth4webapiAuthorizationUrl: async (
          to: URL,
        ): Promise<AuthorizationUrlAndCodeVerifier> => {
          const codeVerifier = generateRandomCodeVerifier();
          const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
  
          const redirectUri = new URL(`${to.origin}/sign-in-done`);
          redirectUri.searchParams.set(
            "to",
            `${to.pathname}${to.search}${to.hash}`,
          );
  
          const authorizationUrl = new URL(
            authorizationServer.authorization_endpoint!,
          );
          authorizationUrl.searchParams.set("client_id", client.client_id);
          authorizationUrl.searchParams.set("redirect_uri", redirectUri.href);
          authorizationUrl.searchParams.set("response_type", "code");
          authorizationUrl.searchParams.set(
            "scope",
            config.public.greensheartAccountsScopes as string,
          );
          authorizationUrl.searchParams.set("code_challenge", codeChallenge);
          authorizationUrl.searchParams.set("code_challenge_method", "S256");
  
          return {
            authorizationUrl,
            codeVerifier,
          };
        },
        oauth4webapiValidateAuthResponse: async (
          url: URL,
          codeVerifier: string,
        ): Promise<AccessTokenAndClaims> => {
          const params = validateAuthResponse(authorizationServer, client, url);
          if (isOAuth2Error(params)) {
            throw createError({
              message: "Cannot validate your sign in request. Please try again.",
            });
          }
  
          const allowedSearchParamKeys = ["to"];
  
          // Remove searchParams keys that are not in our allowlist
          // Primarily meant to remove OpenID params like code, iss, and session_state
          // Also helps with security, to avoid unexpected params
          [...url.searchParams.keys()].forEach((key) => {
            if (!allowedSearchParamKeys.includes(key)) {
              url.searchParams.delete(key);
            }
          });
  
          const authorizationCodeGrantResponse =
            await authorizationCodeGrantRequest(
              authorizationServer,
              client,
              params,
              url.href,
              codeVerifier,
            );
          if (parseWwwAuthenticateChallenges(authorizationCodeGrantResponse)) {
            throw createError({
              message:
                "Cannot validate your sign in request code. Please try again.",
            });
          }
  
          const openIdTokenEndpointResponse =
            await processAuthorizationCodeOpenIDResponse(
              authorizationServer,
              client,
              authorizationCodeGrantResponse,
            );
          if (isOAuth2Error(openIdTokenEndpointResponse)) {
            throw createError({
              message:
                "Cannot validate your sign in request token. Please try again.",
            });
          }
  
          const claims = getValidatedIdTokenClaims(openIdTokenEndpointResponse);
  
          return {
            accessToken: openIdTokenEndpointResponse.access_token,
            claims,
          };
        },
        oauth4webapiUserInfo: async (
          accessToken: string,
        ): Promise<UserInfoResponse> => {
          const response = await userInfoRequest(
            authorizationServer,
            client,
            accessToken,
          );
          if (parseWwwAuthenticateChallenges(response)) {
            throw createError({
              message: "Cannot validate your user info. Please try again.",
            });
          }
  
          return await processUserInfoResponse(
            authorizationServer,
            client,
            skipSubjectCheck,
            response,
          );
        },
      },
    };
  });
  