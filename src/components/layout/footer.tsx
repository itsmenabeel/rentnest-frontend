export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-12">
        <p>© {new Date().getFullYear()} RentNest</p>
        <p>Dhaka, Bangladesh</p>
      </div>
    </footer>
  )
}
