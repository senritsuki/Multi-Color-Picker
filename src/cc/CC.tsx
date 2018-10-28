import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import './CC.css';

import * as cc from './color_converter'

export interface Props {}
export interface State {
    rgbhex: string;
    rgb255: number[];
    rgb01: number[];
    hsl: number[];
    xyz: number[];
    lab: number[];
    lch: number[];
}

export class CC extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            rgbhex: '#000000',
            rgb255: [0, 0, 0], 
            rgb01: [0, 0, 0],  
            hsl: [0, 0, 0], 
            xyz: [0, 0, 0], 
            lab: [0, 0, 0], 
            lch: [0, 0, 0], 
        };
        setTimeout(() => this.setState(getColors_by_lch([75, 50, 0])), 500);
    }
    public render() {
        return (
            <div className="CC ms-Grid">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg2">
                        <h3>RGB hex</h3>
                        <TextField
                            label={'RGB hex'}
                            value={this.state.rgbhex}
                            onChanged={s => { const st = getColors_by_rgbhex(s); if (st) this.setState(st)}}
                        />
                    </div>
                    <div className="ms-Grid-col ms-lg2">
                        <h3>Color</h3>
                        <div style={{width:'100%', height:'61px', backgroundColor:this.state.rgbhex}}></div>
                    </div>
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg2">
                        <h3>RGB (0...255)</h3>
                        {tf_elem3(
                            ['Red', 'Green', 'Blue'], 
                            this.state.rgb255, 
                            [0, 0, 0], [255, 255, 255], [1, 1, 1],
                            (newValues) => this.setState(getColors_by_rgb255(newValues)))}
                    </div>
                    <div className="ms-Grid-col ms-lg2">
                        <h3>RGB (0.0...1.0)</h3>
                        {tf_elem3(
                            ['Red', 'Green', 'Blue'], 
                            this.state.rgb01, 
                            [0, 0, 0], [1, 1, 1], [0.05, 0.05, 0.05],
                            (newValues) => this.setState(getColors_by_rgb01(newValues)))}
                    </div>
                    <div className="ms-Grid-col ms-lg2">
                        <h3>HSL</h3>
                        {tf_elem3(
                            ['Hue', 'Saturation', 'Lightness'], 
                            this.state.hsl, 
                            [-360, 0, 0], [360, 1, 1], [5, 0.05, 0.05],
                            (newValues) => this.setState(getColors_by_hsl(newValues)))}
                    </div>
                    <div className="ms-Grid-col ms-lg2">
                        <h3>XYZ</h3>
                        {tf_elem3(
                            ['X', 'Y', 'Z'], 
                            this.state.xyz, 
                            [0, 0, 0], [1, 1, 1], [0.05, 0.05, 0.05],
                            (newValues) => this.setState(getColors_by_xyz(newValues)))}
                    </div>
                    <div className="ms-Grid-col ms-lg2">
                        <h3>L*a*b*</h3>
                        {tf_elem3(
                            ['Lightness', 'a', 'b'], 
                            this.state.lab, 
                            [0, -100, -100], [100, 100, 100], [5, 5, 5],
                            (newValues) => this.setState(getColors_by_lab(newValues)))}
                    </div>
                    <div className="ms-Grid-col ms-lg2">
                        <h3>L*C*h</h3>
                        {tf_elem3(
                            ['Lightness', 'Chroma', 'Hue'], 
                            this.state.lch, 
                            [0, 0, -360], [100, 100, 360], [5, 5, 5],
                            (newValues) => this.setState(getColors_by_lch(newValues)))}
                    </div>
                </div>
            </div>
        );
    }
}

function getColors_by_rgbhex(rgbhex: string): State|null {
    let rgb255: number[];
    try {
        rgb255 = cc.rgbhexs_to_rgb255(rgbhex);
    } catch {
        return null;
    }
    const rgb01 = cc.rgb255_to_rgb01(rgb255);
    const hsl = cc.rgb01_to_hsl(rgb01);
    const xyz = cc.rgb01_to_xyz(rgb01);
    const lab = cc.xyz_to_lab(xyz);
    const lch = cc.lab_to_lch(lab);
    return {rgbhex, rgb255, rgb01, hsl, xyz, lab, lch}
}

function getColors_by_rgb255(rgb255: number[]): State {
    const rgbhex = cc.rgb255_to_rgbhexs(rgb255);
    const rgb01 = cc.rgb255_to_rgb01(rgb255);
    const hsl = cc.rgb01_to_hsl(rgb01);
    const xyz = cc.rgb01_to_xyz(rgb01);
    const lab = cc.xyz_to_lab(xyz);
    const lch = cc.lab_to_lch(lab);
    return {rgbhex, rgb255, rgb01, hsl, xyz, lab, lch}
}

function getColors_by_rgb01(rgb01: number[]): State {
    const rgb255 = cc.rgb01_to_rgb255(rgb01);
    const rgbhex = cc.rgb255_to_rgbhexs(rgb255);
    const hsl = cc.rgb01_to_hsl(rgb01);
    const xyz = cc.rgb01_to_xyz(rgb01);
    const lab = cc.xyz_to_lab(xyz);
    const lch = cc.lab_to_lch(lab);
    return {rgbhex, rgb255, rgb01, hsl, xyz, lab, lch}
}

function getColors_by_hsl(hsl: number[]): State {
    const rgb01 = cc.hsl_to_rgb01(hsl);
    const rgb255 = cc.rgb01_to_rgb255(rgb01);
    const rgbhex = cc.rgb255_to_rgbhexs(rgb255);
    const xyz = cc.rgb01_to_xyz(rgb01);
    const lab = cc.xyz_to_lab(xyz);
    const lch = cc.lab_to_lch(lab);
    return {rgbhex, rgb255, rgb01, hsl, xyz, lab, lch}
}

function getColors_by_xyz(xyz: number[]): State {
    const lab = cc.xyz_to_lab(xyz);
    const lch = cc.lab_to_lch(lab);
    const rgb01 = cc.xyz_to_rgb01(xyz);
    const rgb255 = cc.rgb01_to_rgb255(rgb01);
    const rgbhex = cc.rgb255_to_rgbhexs(rgb255);
    const hsl = cc.rgb01_to_hsl(rgb01);
    return {rgbhex, rgb255, rgb01, hsl, xyz, lab, lch}
}

function getColors_by_lab(lab: number[]): State {
    const lch = cc.lab_to_lch(lab);
    const xyz = cc.lab_to_xyz(lab);
    const rgb01 = cc.xyz_to_rgb01(xyz);
    const rgb255 = cc.rgb01_to_rgb255(rgb01);
    const rgbhex = cc.rgb255_to_rgbhexs(rgb255);
    const hsl = cc.rgb01_to_hsl(rgb01);
    return {rgbhex, rgb255, rgb01, hsl, xyz, lab, lch}
}

function getColors_by_lch(lch: number[]): State {
    const lab = cc.lch_to_lab(lch);
    const xyz = cc.lab_to_xyz(lab);
    const rgb01 = cc.xyz_to_rgb01(xyz);
    const rgb255 = cc.rgb01_to_rgb255(rgb01);
    const rgbhex = cc.rgb255_to_rgbhexs(rgb255);
    const hsl = cc.rgb01_to_hsl(rgb01);
    return {rgbhex, rgb255, rgb01, hsl, xyz, lab, lch}
}


function tf_elem3(labels: string[], values: number[], mins: number[], maxs: number[], steps: number[], callback: (newValues: number[]) => void): JSX.Element {
    return (
        <div>
            <TextField
                label={labels[0]}
                value={'' + values[0]}
                onChanged={n => callback([+n, values[1], values[2]])}
            />
            <TextField
                label={labels[1]}
                value={'' + values[1]}
                onChanged={n => callback([values[0], +n, values[2]])}
            />
            <TextField
                label={labels[2]}
                value={'' + values[2]}
                onChanged={n => callback([values[0], values[1], +n])}
            />
            <Slider
                label={labels[0]}
                value={values[0]}
                min={mins[0]}
                max={maxs[0]}
                step={steps[0]}
                showValue={false}
                onChange={n => callback([+n, values[1], values[2]])}
            />
            <Slider
                label={labels[1]}
                value={values[1]}
                min={mins[1]}
                max={maxs[1]}
                step={steps[1]}
                showValue={false}
                onChange={n => callback([values[0], +n, values[2]])}
            />
            <Slider
                label={labels[2]}
                value={values[2]}
                min={mins[2]}
                max={maxs[2]}
                step={steps[2]}
                showValue={false}
                onChange={n => callback([values[0], values[1], +n])}
            />
        </div>
    )
}
