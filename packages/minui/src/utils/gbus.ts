/* Bus protocol
 * Highway class is a custom publish/subscribe model,
 * which provides basic notification and trigger functions.
 */


// Highway implementation
// Provide a kind of publish/subscribe model.
// Provide several public interface for the external:
//   1. subscribe (topic)
//   2. emit/publish (event trigger)
export class Highway {
    // Design mode of Singleton
    // But I didn't limit constructor of this class.
    static self = new Highway()
    // A map is used to collect listeners.
    handles = new Map()
    // Framework method, to trigger the related callback functions.
    private dispatch = (id, ...args) => {
        if (!this.handles.has(id)) return
        this.handles.get(id).forEach(handle => {
            try {
                handle(...args)
            } catch (e) {

            }
        })
    }
    // Subscribe a topic before using Highway bus.
    subscribe = (id, handle = () => {}) => {
        if (!this.handles.has(id)) {
            this.handles.set(id, [])
        }
        this.handles.get(id).push(handle)
    }
    // Emit event to Highway bus.
    emit = (id, ...args) => this.dispatch(id, ...args)
    // Same as emit method.
    publish = this.emit
}

export default Highway.self