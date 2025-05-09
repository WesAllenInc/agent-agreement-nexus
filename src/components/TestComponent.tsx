export const TestComponent = () => {
  return (
    <div className="p-6 bg-secondary-50">
      <h1 className="text-3xl font-semibold text-primary-900 mb-4">Test Heading</h1>
      <p className="text-base text-secondary-700 mb-4">
        This is a test paragraph using our typography and colors.
      </p>
      <div className="space-x-4">
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
      </div>
    </div>
  )
}
