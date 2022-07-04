package JavaPrograms;

import java.util.*;

class Codechef {
  public static void main(String[] args) throws java.lang.Exception {
    Scanner sc = new Scanner(System.in);

    int T = sc.nextInt();

    while (T-- > 0) {
      int n = sc.nextInt();
      int m = sc.nextInt();
      int k = sc.nextInt();

      int A[] = new int[n];
      for (int i = 0; i < n; i++) {
        A[i] = sc.nextInt();
      }

      Arrays.sort(A);

      HashMap<Integer, Integer> lessK = new HashMap<>();
      HashMap<Integer, Integer> moreK = new HashMap<>();
      HashMap<Integer, Integer> equalK = new HashMap<>();

      for (int i = 0; i < n; i++) {
        if (A[i] < k) {
          lessK.put(i, A[i]);
        }

        else if (A[i] > k) {
          moreK.put(i, A[i]);
        }

        else {
          equalK.put(i, A[i]);
        }
      }

      System.out.println("Less than K: " + lessK);
      System.out.println("Equal to K: " + equalK);
      System.out.println("More than K: " + moreK);

      boolean allLessThanK = false;
      for (int i = 0; i < k; i++) {
        if (lessK.containsValue(i)) {
          allLessThanK = true;
        } else {
          allLessThanK = false;
          break;
        }
      }

      System.out.println("All less than K: " + allLessThanK);

      if (allLessThanK && (lessK.size() + moreK.size() >= m)) {
        System.out.println("Yes\n");
      } else {
        System.out.println("No\n");
      }

    }

    sc.close();
  }

  static void printArray(int arr[]) {
    System.out.println("\nArray: ");
    for (int i = 0; i < arr.length; i++) {
      System.out.print(arr[i] + " ");
    }
    System.out.println();
  }
}
