export default async function() {
    await new Promise<void>(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
}
