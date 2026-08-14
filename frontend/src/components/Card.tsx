type CardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export default function Card({ title, subtitle, children, actions }: CardProps) {
  return (
    <article className="card">
      <header>
        <h2>{title}</h2>
        {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
      </header>
      <div className="card-body">{children}</div>
      {actions ? <div className="card-actions">{actions}</div> : null}
    </article>
  );
}
