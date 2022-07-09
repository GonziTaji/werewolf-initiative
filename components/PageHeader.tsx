export default function PageHeader({ title, children }) {
    return (
        <div className="sticky top-0 shadow-md">
            <h1 className="text-xl text-center">{title}</h1>

            <div className="border border-black bg-teal-100 px-3 py-4">
                {children}
            </div>
        </div>
    );
}
