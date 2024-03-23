export default function Tooltip({ message, children }) {
    return (
    <div class="group relative flex">
        {children}
        <span class="absolute left-10 scale-0 transition-all rounded bg-gray-800 p-3 text-xs text-white group-hover:scale-100">{message}</span>
    </div>
    )
}
