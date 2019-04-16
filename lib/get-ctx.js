"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let ctx;
exports.getCtx = () => {
    if (!ctx) {
        ctx = new (window.AudioContext ||
            window.webkitAudioContext)();
    }
    return ctx;
};
//# sourceMappingURL=get-ctx.js.map