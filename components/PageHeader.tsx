export default function PageHeader({ title, children, className = '' }) {
    return (
        <div className={'shadow-md ' + className}>
            <h1 className="text-xl text-center">{title}</h1>

            <div className="border border-black bg-teal-100 px-3 py-4">
                {children}
            </div>
        </div>
    );
}
