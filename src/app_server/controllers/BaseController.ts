import { NextResponse } from "next/server";
import { ZodObject, ZodRawShape, z } from "zod";

export const BaseController = {
    // Check schema
    checkSchema<T extends ZodObject<ZodRawShape>>(
        schema: T,
        data: Object
    ): z.infer<T> | false {
        try {
            return schema.parse(data);
        } catch (error) {
            return false;
        }
    },

    // Returning a status code
    makeStatus(code: number, message: string) {
        return NextResponse.json(
            { code, message },
            {
                status: code,
            }
        );
    },
    makeSuccess(code: number, data: any) {
        return NextResponse.json(
            { code, data },
            {
                status: code,
            }
        );
    },
};
