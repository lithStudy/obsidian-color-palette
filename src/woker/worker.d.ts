declare module 'src/woker/myworker.worker' {
	const WorkerFactory: new () => Worker;
	export default WorkerFactory;
}
