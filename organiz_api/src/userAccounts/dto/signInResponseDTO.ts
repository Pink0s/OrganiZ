/**
 * Represents the response DTO for a sign-in operation.
 */
export class SignInResponseDto {
  token: string;
  constructor(token: string) {
    this.token = token;
  }
}
