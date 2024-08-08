import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

/**
 * Custom serializer for Passport sessions.
 *
 * This class is responsible for serializing and deserializing user information
 * for Passport sessions. By default, Passport uses the user ID to identify users
 * in sessions. This serializer overrides the default behavior to store the entire
 * user object in the session.
 */
@Injectable()
export class SessionSerializer extends PassportSerializer {
  /**
   * Serializes the entire user object into a format suitable for storing in the session.
   *
   * By default, this implementation simply returns the user object itself.
   * You can customize this method to transform the user object into a more compact
   * representation for session storage.
   *
   * @param user The user object to serialize.
   * @param done The callback function to be called with the serialized user or an error.
   */
  serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
    done(null, user);
  }

  /**
   * Deserializes the entire user object from the session data.
   *
   * By default, this implementation simply returns the payload (which is the user object in this case).
   * You can customize this method to potentially perform additional logic or validation
   * based on the deserialized user data.
   *
   * @param payload The data retrieved from the session.
   * @param done The callback function to be called with the deserialized user or an error.
   */
  deserializeUser(
    payload: any,
    done: (err: Error | null, payload: string) => void,
  ): any {
    done(null, payload);
  }
}
