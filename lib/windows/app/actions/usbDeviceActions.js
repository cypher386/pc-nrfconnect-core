/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import nrfjprogjs from 'pc-nrfjprog-js';

export const USB_DEVICES_LOAD = 'USB_DEVICES_LOAD';
export const USB_DEVICES_LOAD_SUCCESS = 'USB_DEVICES_LOAD_SUCCESS';
export const USB_DEVICES_LOAD_ERROR = 'USB_DEVICES_LOAD_ERROR';
export const USB_DEVICE_SELECTOR_TOGGLE_EXPANDED = 'USB_DEVICE_SELECTOR_TOGGLE_EXPANDED';
export const USB_DEVICE_SELECTED = 'USB_DEVICE_SELECTED';
export const USB_DEVICE_DESELECTED = 'USB_DEVICE_DESELECTED';

function loadDevicesAction() {
    return {
        type: USB_DEVICES_LOAD,
    };
}

function loadDevicesSuccessAction(devices) {
    return {
        type: USB_DEVICES_LOAD_SUCCESS,
        devices,
    };
}

function loadDevicesErrorAction(message) {
    return {
        type: USB_DEVICES_LOAD_ERROR,
        message,
    };
}

function selectorToggleExpandedAction() {
    return {
        type: USB_DEVICE_SELECTOR_TOGGLE_EXPANDED,
    };
}

function selectDeviceAction(device) {
    return {
        type: USB_DEVICE_SELECTED,
        device,
    };
}

function getSerialNumbers() {
    return new Promise((resolve, reject) => {
        nrfjprogjs.getSerialNumbers((err, serialNumbers) => {
            if (err) {
                reject(err);
            } else {
                resolve(serialNumbers);
            }
        });
    });
}

export function loadDevices() {
    return dispatch => {
        dispatch(loadDevicesAction());
        getSerialNumbers()
            .then(serialNumbers => {
                const devices = serialNumbers.map(serialNumber => ({
                    serialNumber,
                }));
                dispatch(loadDevicesSuccessAction(devices));
            })
            .catch(error => loadDevicesErrorAction(error.message));
    };
}

export function toggleSelectorExpanded() {
    return (dispatch, getState) => {
        const state = getState();
        if (!state.core.usbDevice.isSelectorExpanded) {
            dispatch(loadDevices());
        }
        dispatch(selectorToggleExpandedAction());
    };
}

export function selectDevice(device) {
    return selectDeviceAction(device);
}

export function deselectDevice() {
    return {
        type: USB_DEVICE_DESELECTED,
    };
}