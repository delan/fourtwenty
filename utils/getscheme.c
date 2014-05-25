#include <stdio.h>
#include <wand/MagickWand.h>

int ThrowWandException(MagickWand *w) {
	ExceptionType s;
	char *d = MagickGetException(w, &s);
	fprintf(stderr, "error %d: %s\n", s, d);
	MagickRelinquishMemory(d);
	return 1;
}

int main(int argc, char **argv) {
	int retval = 0;
	MagickWand *m;
	PixelWand *p;
	double br, bg, bb, fr, fg, fb;
	ssize_t bx, by, fx, fy;
	bx = atoi(argv[2]);
	by = atoi(argv[3]);
	fx = atoi(argv[4]);
	fy = atoi(argv[5]);
	if (argc < 4) {
		fputs("usage: getscheme f bx by fx fy name\n", stderr);
		return 1;
	}
	MagickWandGenesis();
	m = NewMagickWand();
	p = NewPixelWand();
	if (MagickReadImage(m, argv[1]) == MagickFalse) {
		retval = ThrowWandException(m);
		goto cleanup;
	}
	if (MagickGetImagePixelColor(m, bx, by, p) == MagickFalse) {
		retval = ThrowWandException(m);
		goto cleanup;
	}
	br = PixelGetRed(p);
	bg = PixelGetGreen(p);
	bb = PixelGetBlue(p);
	if (MagickGetImagePixelColor(m, fx, fy, p) == MagickFalse) {
		retval = ThrowWandException(m);
		goto cleanup;
	}
	fr = PixelGetRed(p);
	fg = PixelGetGreen(p);
	fb = PixelGetBlue(p);
	printf(
		"\tnew Scheme('%s', %d, %d, %d, %d, %d, %d),\n",
		argv[6],
		(int)(br * 255),
		(int)(bg * 255),
		(int)(bb * 255),
		(int)(fr * 255),
		(int)(fg * 255),
		(int)(fb * 255)
	);
	cleanup:
	DestroyPixelWand(p);
	DestroyMagickWand(m);
	MagickWandTerminus();
	return retval;
}
