type Props = {
  message?: string;
  code?: number;
  errors?: Record<string, string[]>;
};

export class Exception {
  readonly message: string;
  readonly code: number;
  readonly errors: Record<string, string[]>;

  constructor(props?: Props) {
    console.log('exception');
    this.message = props?.message ? props.message : 'Something went wrong!';
    this.code = props?.code ? props.code : 500;
    this.errors = props?.errors ? props.errors : {};
  }
}
